/**
 * @author: xiaodengpao
 * @date: 2016-12-08
*/

(function(){

	// 保证Window、undefined变量的正确性
	var window = this;
	var undefined;

	// 保存window下的jquery $ 变量
	var _jQuery = window.jQuery;
	var _$ = window.$;

	var jQuery = function( selector, context ){

		// jquery（）运行后，返回的是jQuery.prototype.init构造函数的实例
		// jquery().a()  想实现这样，就需要把jquery的原型放到jQuery.prototype.init.prototype上去。即：jQuery.fn.init.prototype = jQuery.fn;
		// 但是构造出来的对象，类名为init，显然这不是我们想要的
		return new jQuery.fn.init( selector, context )
	}

	// jQuery的原型
	jQuery.fn = jQuery.prototype = {
		// 选择器分析
		init:function( selector, context ){
			
			// selector为空时，取document
			selector = selector || document;
			
			// 处理DOMElement类型
			if( selector.nodeType ) {
				this[0] = selector;
				this.length = 1;
				this.context = selector;
				return this;
			}

			// 处理字符串(选择器)
			if( typeof(selector) === 'string' ){
				this.context = context || document;
				var that = this;
			    var elements = this.context.querySelectorAll(selector);
			    elements.forEach( function( item, index, array ){
			    	that[index] = item;
			    });
			    this.length = elements.length;
			    return this;
			}
		},

		// 空选择器
		selector: "",

		// 版本号
		jquery: "1.3.1",

		// 所选择的DOM数目
		size: function() {
			return this.length;
		},

		// 不传参返回一个空数组，或者返回第N个DOM
		get: function( num ) {
			return num === undefined ?

				// 创建空数组
				jQuery.makeArray( this ) :

				// 返回第N个DOM
				this[ num ];
		}
	}

	// extend扩展方法
	// extend分为 $.extend:扩展自身；$.fn.extend:扩展原型,这两种方法其实是一个方法，因为调用者不同，所以this指向不同，以此附加到不同的对象上
	// jQuery.extend( [deep ], target, object1 [, objectN ] )
	jQuery.extend = jQuery.fn.extend = function() {
		
		// 初始化参数，用arguments，严格模式下失效 depp:是否深拷贝 i:object[N] 参数的索引
		var target = arguments[0] || {}, i = 1, length = arguments.length, deep = false, options;

		// 是否深拷贝，初始化为false
		if ( typeof target === "boolean" ) {
			deep = target; 
			target = arguments[1] || {};
			// 索引跳过第一个参数
			i = 2;
		}
		
		// 如果target不是对象也不是一个函数（可能用户输错了，字符串等乱七八糟的），新建一个空对象
		if ( typeof target !== "object" && !toString.call(target) === "[object Function]" ){
			target = {};
		}
		
		// 	没有target,则给自己扩展
		if( length === i ){
			target = this;
			i--;
		}

		// 深拷贝，拷贝到length-1 
		for ( ; i < length; i++ ){
			// 只拷贝非null值
			if ( (options = arguments[ i ]) != null ){
				// for in 循环，拷贝每个argunments[i]的 key&value
				for ( var name in options ) {
					var src = target[ name ], copy = options[ name ];

					// 防止循环引用
					if ( target === copy )
						continue;
					
					if ( deep && copy && typeof copy === "object" && !copy.nodeType ){
						target[ name ] = jQuery.extend( deep, 
							// Never move original objects, clone them
							src || ( copy.length != null ? [ ] : { } )
						, copy );
					}else if ( copy !== undefined ){
						target[ name ] = copy;
					}	
				}
			}
		}

		// 返回target
		return target;
	};

	// 替换原型
	jQuery.fn.init.prototype = jQuery.fn;
	// 替换构造函数
	jQuery.fn.constructor = jQuery;

	// 强行将window对象的$赋值到jQuery对象，这样的话，如果有冲突可以调用noConflict方法，解决冲突
	window.$ = jQuery;

	// 扩展方法
	$.extend({

		isFunction: function( obj ) {
			// window 对象方法,Object.toString方法不同
			return toString.call(obj) === "[object Function]";
		},

		isArray: function( obj ) {
			return toString.call(obj) === "[object Array]";
		},
		
		trim: function( text ) {
			// 去除两侧空格
			return (text || "").replace( /^\s+|\s+$/g, "" );
		},

		// each方法，遍历object对象
		each: function( object, callback, args ) {

			var name, i = 0, length = object.length;

			// 如果传入参数
			if ( args ) {
				if ( length === undefined ) {
					for ( name in object ){
						// 改了一下源码，args不能是数组 ps:我觉得我说的有歧义
						if ( object.hasOwnProperty(name) && ( callback.call( object[ name ], args ) === false ) )
							break;
					}
				} else
					for ( ; i < length; )
						if ( callback.call( object[ i++ ], args ) === false )
							break;
			// 如果未传参
			} else {
				// 如果是遍历对象
				if ( length === undefined ) { 
					for ( name in object )
						// 函数返回false就终止遍历
						if ( object.hasOwnProperty(name) && callback.call( object[ name ], name, object[ name ] )=== false )
							break;
				} else{
					for ( var value = object[0];
						i < length && callback.call( value, i, value ) !== false; value = object[++i] ){}
				}
			}
			return object;
		},

		// 解决命名空间冲突
		noConflict: function(deep) {
			// 判断全局 $ 变量是否等于 jQuery 变量
			// 如果等于，则重新还原全局变量 $ 为 jQuery 运行之前的变量（存储在内部变量 _$ 中）
			if (window.$ === jQuery) {
				// 此时 jQuery 别名 $ 失效
				window.$ = _$;
			}
			// 当开启深度冲突处理并且全局变量 jQuery 等于内部 jQuery，则把全局 jQuery 还原成之前的状况
			if (deep && window.jQuery === jQuery) {
				// 如果 deep 为 true，此时 jQuery 失效
				window.jQuery = _jQuery;
			}

			// 这里返回的是 jQuery
			// var $a = $.noConflict(); 
			return jQuery;
		}

	});
})()


console.log( $('#status') );
