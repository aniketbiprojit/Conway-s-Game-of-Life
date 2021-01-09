
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.31.2' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src/App.svelte generated by Svelte v3.31.2 */

    const file = "src/App.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[8] = list[i];
    	child_ctx[10] = i;
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[8] = list[i];
    	child_ctx[12] = i;
    	return child_ctx;
    }

    // (38:3) {#each Array(num) as _, j}
    function create_each_block_1(ctx) {
    	let div;
    	let p;
    	let t0_value = /*i*/ ctx[10] + "," + /*j*/ ctx[12] + "";
    	let t0;
    	let t1;
    	let div_id_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			p = element("p");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(p, "class", "svelte-uudi1h");
    			add_location(p, file, 39, 5, 816);
    			attr_dev(div, "class", "" + (null_to_empty("cell") + " svelte-uudi1h"));
    			attr_dev(div, "id", div_id_value = (/*i*/ ctx[10] * /*num*/ ctx[0] + /*j*/ ctx[12]).toString());
    			attr_dev(div, "data-x", ctx[10]);
    			attr_dev(div, "data-y", ctx[12]);
    			add_location(div, file, 38, 4, 738);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, p);
    			append_dev(p, t0);
    			append_dev(div, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*num*/ 1 && div_id_value !== (div_id_value = (/*i*/ ctx[10] * /*num*/ ctx[0] + /*j*/ ctx[12]).toString())) {
    				attr_dev(div, "id", div_id_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(38:3) {#each Array(num) as _, j}",
    		ctx
    	});

    	return block;
    }

    // (37:2) {#each Array(num) as _, i}
    function create_each_block(ctx) {
    	let each_1_anchor;
    	let each_value_1 = Array(/*num*/ ctx[0]);
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*num*/ 1) {
    				each_value_1 = Array(/*num*/ ctx[0]);
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(37:2) {#each Array(num) as _, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let main;
    	let span;
    	let t0;
    	let button0;
    	let t2;
    	let button1;
    	let t4;
    	let button2;
    	let t6;
    	let button3;
    	let t8;
    	let div;
    	let t9;
    	let h1;
    	let t11;
    	let li0;
    	let t13;
    	let li1;
    	let t15;
    	let li2;
    	let t17;
    	let li3;
    	let mounted;
    	let dispose;
    	let each_value = Array(/*num*/ ctx[0]);
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			main = element("main");
    			span = element("span");
    			t0 = space();
    			button0 = element("button");
    			button0.textContent = "Run Once";
    			t2 = space();
    			button1 = element("button");
    			button1.textContent = "Start";
    			t4 = space();
    			button2 = element("button");
    			button2.textContent = "Stop";
    			t6 = space();
    			button3 = element("button");
    			button3.textContent = "Reset";
    			t8 = space();
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t9 = space();
    			h1 = element("h1");
    			h1.textContent = "Rules";
    			t11 = space();
    			li0 = element("li");
    			li0.textContent = "Any live cell with fewer than two live neighbours dies, as if by underpopulation.";
    			t13 = space();
    			li1 = element("li");
    			li1.textContent = "Any live cell with two or three live neighbours lives on to the next generation.";
    			t15 = space();
    			li2 = element("li");
    			li2.textContent = "Any live cell with more than three live neighbours dies, as if by overpopulation.";
    			t17 = space();
    			li3 = element("li");
    			li3.textContent = "Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.";
    			attr_dev(span, "class", "alive svelte-uudi1h");
    			add_location(span, file, 30, 1, 443);
    			add_location(button0, file, 31, 1, 467);
    			add_location(button1, file, 32, 1, 512);
    			add_location(button2, file, 33, 1, 559);
    			add_location(button3, file, 34, 1, 604);
    			attr_dev(div, "class", "grid svelte-uudi1h");
    			add_location(div, file, 35, 1, 656);
    			add_location(h1, file, 45, 1, 916);
    			add_location(li0, file, 46, 1, 932);
    			add_location(li1, file, 47, 1, 1024);
    			add_location(li2, file, 48, 1, 1115);
    			add_location(li3, file, 49, 1, 1207);
    			add_location(main, file, 29, 0, 435);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, span);
    			append_dev(main, t0);
    			append_dev(main, button0);
    			append_dev(main, t2);
    			append_dev(main, button1);
    			append_dev(main, t4);
    			append_dev(main, button2);
    			append_dev(main, t6);
    			append_dev(main, button3);
    			append_dev(main, t8);
    			append_dev(main, div);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			append_dev(main, t9);
    			append_dev(main, h1);
    			append_dev(main, t11);
    			append_dev(main, li0);
    			append_dev(main, t13);
    			append_dev(main, li1);
    			append_dev(main, t15);
    			append_dev(main, li2);
    			append_dev(main, t17);
    			append_dev(main, li3);

    			if (!mounted) {
    				dispose = [
    					listen_dev(
    						button0,
    						"click",
    						function () {
    							if (is_function(/*update*/ ctx[1])) /*update*/ ctx[1].apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(button1, "click", /*click_handler*/ ctx[5], false, false, false),
    					listen_dev(button2, "click", /*click_handler_1*/ ctx[6], false, false, false),
    					listen_dev(button3, "click", /*click_handler_2*/ ctx[7], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;

    			if (dirty & /*Array, num*/ 1) {
    				each_value = Array(/*num*/ ctx[0]);
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("App", slots, []);
    	let { num } = $$props;

    	let { update } = $$props,
    		{ start } = $$props,
    		{ stop } = $$props,
    		{ resetCells } = $$props;

    	const writable_props = ["num", "update", "start", "stop", "resetCells"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => start();
    	const click_handler_1 = () => stop();
    	const click_handler_2 = () => resetCells();

    	$$self.$$set = $$props => {
    		if ("num" in $$props) $$invalidate(0, num = $$props.num);
    		if ("update" in $$props) $$invalidate(1, update = $$props.update);
    		if ("start" in $$props) $$invalidate(2, start = $$props.start);
    		if ("stop" in $$props) $$invalidate(3, stop = $$props.stop);
    		if ("resetCells" in $$props) $$invalidate(4, resetCells = $$props.resetCells);
    	};

    	$$self.$capture_state = () => ({ num, update, start, stop, resetCells });

    	$$self.$inject_state = $$props => {
    		if ("num" in $$props) $$invalidate(0, num = $$props.num);
    		if ("update" in $$props) $$invalidate(1, update = $$props.update);
    		if ("start" in $$props) $$invalidate(2, start = $$props.start);
    		if ("stop" in $$props) $$invalidate(3, stop = $$props.stop);
    		if ("resetCells" in $$props) $$invalidate(4, resetCells = $$props.resetCells);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		num,
    		update,
    		start,
    		stop,
    		resetCells,
    		click_handler,
    		click_handler_1,
    		click_handler_2
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance, create_fragment, safe_not_equal, {
    			num: 0,
    			update: 1,
    			start: 2,
    			stop: 3,
    			resetCells: 4
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*num*/ ctx[0] === undefined && !("num" in props)) {
    			console.warn("<App> was created without expected prop 'num'");
    		}

    		if (/*update*/ ctx[1] === undefined && !("update" in props)) {
    			console.warn("<App> was created without expected prop 'update'");
    		}

    		if (/*start*/ ctx[2] === undefined && !("start" in props)) {
    			console.warn("<App> was created without expected prop 'start'");
    		}

    		if (/*stop*/ ctx[3] === undefined && !("stop" in props)) {
    			console.warn("<App> was created without expected prop 'stop'");
    		}

    		if (/*resetCells*/ ctx[4] === undefined && !("resetCells" in props)) {
    			console.warn("<App> was created without expected prop 'resetCells'");
    		}
    	}

    	get num() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set num(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get update() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set update(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get start() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set start(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get stop() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set stop(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get resetCells() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set resetCells(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const num = 10;
    const app = new App({
        target: document.body,
        props: {
            num,
            update: update$1,
            start,
            stop,
            resetCells,
        },
    });
    const grid = Array.from(Array(num), () => new Array(num));
    class Cell {
        constructor(block) {
            this.alive = false;
            this.neighbours = 0;
            this.block = block;
            grid[parseInt(block.dataset.x)][parseInt(block.dataset.y)] = this;
            if (Math.random() < 0.2) {
                block.classList.add('alive');
                this.alive = true;
            }
        }
        kill() {
            this.alive = false;
            this.block.classList.remove('alive');
        }
        raise() {
            this.alive = true;
            this.block.classList.add('alive');
        }
        setInner(text) {
            this.block.children[0].innerHTML = text;
        }
    }
    const cells = document.getElementsByClassName('cell');
    Array.from(cells).forEach((element) => {
        if (element instanceof HTMLElement) {
            new Cell(element);
        }
    });
    function update$1() {
        let total_count = 0;
        for (let i = 0; i < num; i++) {
            for (let j = 0; j < num; j++) {
                const cell = grid[i][j];
                const neighbours = countNeighbours(i, j);
                total_count += neighbours;
                cell.neighbours = neighbours;
                cell.setInner(neighbours.toString());
            }
        }
        const copy_of_grid = Object.assign({}, grid);
        if (total_count === 0) {
            resetCells();
        }
        else {
            for (let i = 0; i < num; i++) {
                for (let j = 0; j < num; j++) {
                    const cell = copy_of_grid[i][j];
                    if (cell.alive) {
                        if (cell.neighbours < 2 || cell.neighbours > 3) {
                            cell.kill();
                        }
                    }
                    else {
                        if (cell.neighbours === 3) {
                            cell.raise();
                        }
                    }
                }
            }
        }
    }
    function resetCells() {
        stop();
        for (let i = 0; i < num; i++) {
            for (let j = 0; j < num; j++) {
                const cell = grid[i][j];
                if (Math.random() < 0.2)
                    cell.raise();
            }
        }
    }
    function countNeighbours(i, j) {
        let count = 0;
        for (let x_off = -1; x_off <= 1; x_off++) {
            for (let y_off = -1; y_off <= 1; y_off++) {
                const x = (i + x_off) % num;
                const y = (j + y_off + num) % num;
                if (x == -1) {
                    continue;
                }
                if (grid[x][y].alive) {
                    count++;
                }
            }
        }
        if (grid[i][j].alive) {
            count--;
        }
        return count;
    }
    let interval;
    function start() {
        if (interval)
            clearInterval(interval);
        interval = setInterval(update$1, 100);
    }
    function stop() {
        if (interval)
            clearInterval(interval);
    }
    start();

    return app;

}());
//# sourceMappingURL=bundle.js.map
