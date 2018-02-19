"use strict";angular.module("ui.ace",[]).constant("uiAceConfig",{}).directive("uiAce",["uiAceConfig",function(uiAceConfig){if(angular.isUndefined(window.ace)){throw new Error("ui-ace need ace to work... (o rly?)")}var setOptions=function(acee,session,opts){if(angular.isDefined(opts.workerPath)){var config=window.ace.require("ace/config");config.set("workerPath",opts.workerPath)}if(angular.isDefined(opts.require)){opts.require.forEach(function(n){window.ace.require(n)})}if(angular.isDefined(opts.showGutter)){acee.renderer.setShowGutter(opts.showGutter)}if(angular.isDefined(opts.useWrapMode)){session.setUseWrapMode(opts.useWrapMode)}if(angular.isDefined(opts.showInvisibles)){acee.renderer.setShowInvisibles(opts.showInvisibles)}if(angular.isDefined(opts.showIndentGuides)){acee.renderer.setDisplayIndentGuides(opts.showIndentGuides)}if(angular.isDefined(opts.useSoftTabs)){session.setUseSoftTabs(opts.useSoftTabs)}if(angular.isDefined(opts.showPrintMargin)){acee.setShowPrintMargin(opts.showPrintMargin)}if(angular.isDefined(opts.disableSearch)&&opts.disableSearch){acee.commands.addCommands([{name:"unfind",bindKey:{win:"Ctrl-F",mac:"Command-F"},exec:function(){return false},readOnly:true}])}if(angular.isString(opts.theme)){acee.setTheme("ace/theme/"+opts.theme)}if(angular.isString(opts.mode)){session.setMode("ace/mode/"+opts.mode)}if(angular.isDefined(opts.firstLineNumber)){if(angular.isNumber(opts.firstLineNumber)){session.setOption("firstLineNumber",opts.firstLineNumber)}else if(angular.isFunction(opts.firstLineNumber)){session.setOption("firstLineNumber",opts.firstLineNumber())}}var key,obj;if(angular.isDefined(opts.advanced)){for(key in opts.advanced){obj={name:key,value:opts.advanced[key]};acee.setOption(obj.name,obj.value)}}if(angular.isDefined(opts.rendererOptions)){for(key in opts.rendererOptions){obj={name:key,value:opts.rendererOptions[key]};acee.renderer.setOption(obj.name,obj.value)}}angular.forEach(opts.callbacks,function(cb){if(angular.isFunction(cb)){cb(acee)}})};return{restrict:"EA",require:"?ngModel",link:function(scope,elm,attrs,ngModel){var options=uiAceConfig.ace||{};var opts=angular.extend({},options,scope.$eval(attrs.uiAce));var acee=window.ace.edit(elm[0]);var session=acee.getSession();var onChangeListener;var onBlurListener;var executeUserCallback=function(){var callback=arguments[0];var args=Array.prototype.slice.call(arguments,1);if(angular.isDefined(callback)){scope.$evalAsync(function(){if(angular.isFunction(callback)){callback(args)}else{throw new Error("ui-ace use a function as callback.")}})}};var listenerFactory={onChange:function(callback){return function(e){var newValue=session.getValue();if(ngModel&&newValue!==ngModel.$viewValue&&!scope.$$phase&&!scope.$root.$$phase){scope.$evalAsync(function(){ngModel.$setViewValue(newValue)})}executeUserCallback(callback,e,acee)}},onBlur:function(callback){return function(){executeUserCallback(callback,acee)}}};attrs.$observe("readonly",function(value){acee.setReadOnly(!!value||value==="")});if(ngModel){ngModel.$formatters.push(function(value){if(angular.isUndefined(value)||value===null){return""}else if(angular.isObject(value)||angular.isArray(value)){throw new Error("ui-ace cannot use an object or an array as a model")}return value});ngModel.$render=function(){session.setValue(ngModel.$viewValue)}}var updateOptions=function(current,previous){if(current===previous)return;opts=angular.extend({},options,scope.$eval(attrs.uiAce));opts.callbacks=[opts.onLoad];if(opts.onLoad!==options.onLoad){opts.callbacks.unshift(options.onLoad)}session.removeListener("change",onChangeListener);onChangeListener=listenerFactory.onChange(opts.onChange);session.on("change",onChangeListener);acee.removeListener("blur",onBlurListener);onBlurListener=listenerFactory.onBlur(opts.onBlur);acee.on("blur",onBlurListener);setOptions(acee,session,opts)};scope.$watch(attrs.uiAce,updateOptions,true);updateOptions(options);elm.on("$destroy",function(){acee.session.$stopWorker();acee.destroy()});scope.$watch(function(){return[elm[0].offsetWidth,elm[0].offsetHeight]},function(){acee.resize();acee.renderer.updateFull()},true)}}}]);