// Tab Switcher
// Author: Marghoob Suleman | Search me on google (http://www.google.com/search?q=marghoob+suleman)
// jquery.mstabs.js
// Created: unknown date
// version: 2.5
// Revision: 18
// Features/public methods: next, previous, auto, getTitle, switchTabByCounter and more...
// example: var oTabs = $("#mainTabHolder").msTabs({tabs:'.tabclass', defaultTab:1, effects:'slide', speed:'slow', selected:'selected', toggle:false, callback:callbackmethod}).data("msTabs");
//
// msTabs is free jQuery Plugin: you can redistribute it and/or modify
// it under the terms of the either the MIT License or the Gnu General Public License (GPL) Version 2
;(function($){
		   var msMyTabs = function(element, opt) {
			var settings = $.extend({
								  tabs:'a',
								  contentSuffix:'_content',
								  event:'click',
								  selected:'selected',
								  speed:'fast',
								  effects:'fade',
								  callback:'',
								  defaultTab:'',
								  onInit:'',
								  dynamic:false,
								  ignoreDynamic:'ignoreDynamic',
								  callbackAfterDynamic:'',
								  cache:true,
								  loadingText:'loading...',
								  closeAllHandle:'',
								  closeAllCallback:'',
								  toggle:false,
								  toggleOffCallback:'',
								  auto:0
								  }, opt);		
			   var $this = this; //class object
			   var e = $(element).prop("id", ei);
			   if(e=="" || typeof e=="undefined") {
				   var ei = "mstabsHolder_"+($.msTabs.counter++);
				   $(element).attr("id", ei);   
			   };
			   var elementid = $(element).prop("id");
			  // $.msTabs
			   var oProp = new Object();
			   oProp.old = "";
			   oProp.isFirst = 0;
			   oProp.isLast = 0;
			   oProp.currenTabCounter =0;
			   var internalTabClassName = "msTabsContents"+elementid;
			   var internalTabPointers = "msTabsPointer"+elementid;
			   var cacheData = {};
			   var intid = 0;
				
			   var init = function() {
				   //first time only
				   $("#"+elementid + " " + settings.tabs).addClass(internalTabPointers);
				   
				   $("#"+elementid + " " + settings.tabs).bind(settings.event, function(evt) {
					   																
																					  $this.switchTab(this.id);
																					  evt.preventDefault();
																					  evt.stopPropagation();
																					 // evt.blur();
																					  
																					  if(true==settings.dynamic) {
																						  var href = this.href;
																						  var hasIngoreClass = $(this).hasClass(settings.ignoreDynamic);
																						  if(typeof(href)!=undefined && hasIngoreClass==false) {
																							  $this.loadFile(href, this.id);
																						  };
																					  };
																					  
																					  });
				   //console.debug("elementid "+elementid +" 5 ");
				   //if tabs has a inside
				   if($("#"+elementid + " " + settings.tabs +" a").length>0) {
					 $("#"+elementid + " " + settings.tabs +" a").bind(settings.event, function(evt) {
																					  evt.preventDefault();
																					  evt.stopPropagation();
																					  return false;
																					  });				   
				   };
				   //console.debug("elementid "+elementid +" 6 ");
				  //hide all content
				   var allTabs = $("#"+elementid + " " + settings.tabs);
				   oProp.allTabs = allTabs;
				   if(settings.defaultTab=='') {
					   settings.defaultTab = $("#"+elementid + " " + settings.tabs)[0].id;
					   //alert("settings.defaultTab "+settings.defaultTab);
				   } else if(typeof(settings.defaultTab)=="number" && settings.defaultTab!=-1) {
					   settings.defaultTab = $("#"+elementid + " " + settings.tabs)[settings.defaultTab].id;
				   };				   
				   for(var iCount=0;iCount<allTabs.length;iCount++) {
					   if(settings.defaultTab!=allTabs[iCount].id) {
						   $("#"+allTabs[iCount].id+settings.contentSuffix).hide();
						   //set class for internal use
					   };
					    $("#"+allTabs[iCount].id+settings.contentSuffix).addClass(internalTabClassName);
				   };
				   if(settings.defaultTab!=-1) {
					$this.switchTab(settings.defaultTab);
				   };
				   
				   if(settings.auto>0) {
					   //make it auto tab
				    $("#"+elementid + " " + settings.tabs).bind("mouseover", function(evt) {
																					  evt.preventDefault();
																					  pauseTabs();
																					  });
				    $("#"+elementid + " " + settings.tabs).bind("mouseout", function(evt) {
																					 evt.preventDefault();
																					  startAutoTabs();
																					  });
				    $("."+internalTabClassName).bind("mouseover", function(evt) {
																					  evt.preventDefault();
																					  pauseTabs();
																					  });
				    $("."+internalTabClassName).bind("mouseout", function(evt) {
																					 evt.preventDefault();
																					  startAutoTabs();
																					  });
						//start auto
					   startAutoTabs();
				   };
			   	
				if(settings.onInit!='') {
					eval(settings.onInit)($this);
				};
				if(settings.closeAllHandle!='') {
					//console.log("1");
					$(settings.closeAllHandle).bind("click", function() {
						if(settings.closeAllCallback!='') {
							//alert(callback);
							eval(settings.closeAllCallback)($this);
						};
						$this.closeAll();
					});
				 };
				
			   };
			   
			   var nextTab = function () {
				   oProp.isLast = 0;
				   var totalTabs = oProp.allTabs;
				   if(oProp.currenTabCounter < totalTabs.length-1) {
					   oProp.currenTabCounter++;
					   var tabid = totalTabs[oProp.currenTabCounter].id;
					   //next is success
					   if(oProp.currenTabCounter == totalTabs.length-1) {
						   oProp.isLast = 1;
					   };
					   $this.switchTab(tabid);
				   };
				   //alert(" oProp.isLast " + oProp.isLast);
				   //zero means last
				   return oProp.isLast;
			   };
			   var previousTab = function () {
				   oProp.isFirst = 0;
				   var totalTabs = oProp.allTabs;
				   if(oProp.currenTabCounter > 0) {
					   oProp.currenTabCounter--;
					   var tabid = totalTabs[oProp.currenTabCounter].id;
					   //next is success
					   if(oProp.currenTabCounter==0) {
						   oProp.isFirst = 1;
					   };
					   $this.switchTab(tabid);
				   };
				   //zero means first
				   return oProp.isFirst;
			   };
			   var getTabPosition = function (id) {
				   var allTabs = oProp.allTabs;
				   	for(var iCount=0;iCount<allTabs.length;iCount++) {
						if(allTabs[iCount].id==id) {
							return iCount;
						};
					};
					return -1;
			   };
			   var getContentId = function(tabId) {
				   var content = tabId+settings.contentSuffix;
				   //alert(content)
				   return content; 
			   };
			   var closeDiv = function(div, cb) {
				   var divid = div;
				   var callback = cb;
				   if(settings.effects=='fade') {
					   $("#"+divid).fadeOut(settings.speed, function() {
						   if(typeof(callback)!="undefined") {
							   callback.apply(this, arguments);
						   };
					   });
				   } else if(settings.effects=='none' || settings.effects=='') {
					   $("#"+divid).css({display:'none'});
					   callback.apply(this, arguments);
				   } else {
					   $("#"+divid).slideUp(settings.speed, function() {
						   if(typeof(callback)!="undefined") {
							   callback.apply(this, arguments);
						   };
						   });
				   };
			   };
			   var openDiv = function(div, cb) {
				   var divid = div;
				   var callback = cb;
				   if(settings.effects=='fade') {
					   $("#"+divid).fadeIn(settings.speed, function() {
						   if(typeof(callback)!="undefined") {
							   callback.apply(this, arguments);
						   };
					   });
				   } else if(settings.effects=='none' || settings.effects=='') {
					   $("#"+divid).css({display:'block'});
					   callback.apply(this, arguments);
				   } else {
					   $("#"+divid).slideDown(settings.speed, function() {
						   if(typeof(callback)!="undefined") {
							   callback.apply(this, arguments);
						   };
						});
				   };
			   };
				var fireToggleOffCallback = function() {
				   if(settings.toggleOffCallback!='') {
					   //alert(id+" settings.callback "+settings.callback);
					   eval(settings.toggleOffCallback)($this);
				   };				   				   	
			   };

			   var fireCallback = function() {
				   oProp.old = oProp.tabId;
				   oProp.oldContent = oProp.content;				   
				   if(settings.callback!='') {
					   //alert(id+" settings.callback "+settings.callback);
					   eval(settings.callback)($this);
				   };				   				   	
			   };
			   var autoTabs = function () {
				   var totalTabs = oProp.allTabs;
				   var isLast = nextTab();
				   //console.debug("isLast "+isLast);
				   if(isLast===1) {
					   	oProp.currenTabCounter = -1;
				   };
			   };
			   var pauseTabs = function() {
				   window.clearInterval(intid);
			   };
			   var startAutoTabs = function() {
				   if(settings.auto>0) {
					   //make it auto tab
					 if(intid!=0) {
						window.clearInterval(intid);
					 };
					intid = window.setInterval(autoTabs, settings.auto);
				   };
			   };
			   //public methods
			   this.previous = function() {
				   var isSuccess = previousTab();
				   return isSuccess;
			   };		   
			   this.next = function() {
				   var isSuccess = nextTab();
				   return isSuccess;
			   };
			   this.switchTab = function(evt) {
				   if(typeof(evt)!="string") {
					   evt.preventDefault();
					   evt.stopPropagation();
				   } else if(typeof(evt)=="string") {
					   $("#"+evt).show();
				   };
				   var id = (typeof(evt)=="string") ? evt : this.id; //$(this).attr("id");
				   
				   oProp.tabId = id;
				   oProp.currenTabCounter = getTabPosition(id);
				   var content = getContentId(id).toString();
				   oProp.content = content;
				   if(settings.toggle==true) {
					   if(oProp.old==id) { //same
						   if($("#"+oProp.oldContent +":visible").length>0) {
							   //hide me
							   $("#"+oProp.old).removeClass(settings.selected);
							   closeDiv(oProp.oldContent, function() {
								   fireToggleOffCallback();
							   });
							} else {
								$("#"+id).addClass(settings.selected);
								openDiv(content, function() {
									   fireCallback(); 
								   });
							};
					   } else {
						   //alert(oProp.content + " content");
						   if(oProp.old!="") {
							   $("#"+oProp.old).removeClass(settings.selected);
							   closeDiv(oProp.oldContent, function() {
								   $("#"+id).addClass(settings.selected);
								   openDiv(content, function() {
									   fireCallback(); 
								   });
							   });
						   } else  {
							   //openCloseDivInit(id);
							   $("#"+id).addClass(settings.selected);
							   openDiv(content, function() {
								   fireCallback();
							   });
						   };
					   };
				   } else {				   
					   //alert(oProp.content + " content");
					   if(oProp.old!="") {
						   $("#"+oProp.old).removeClass(settings.selected);
						   closeDiv(oProp.oldContent, function() {
							   $("#"+id).addClass(settings.selected);
							   openDiv(content, function() {
								   fireCallback(); 
							   });
						   });
					   } else {
						   $("#"+id).addClass(settings.selected);
						   openDiv(content, function() {
							   fireCallback();
						   });
					   };
					   
				   };
				   //for old values
				   oProp.old = oProp.tabId;
				   oProp.oldContent = oProp.content;
			   };			   
			   this.getTitle = function(h) {	
			   		return (h===true) ? $("#"+oProp.tabId).html() : $("#"+oProp.tabId).text();
			   };
			   this.getCurrentCounter = function() {
				   return oProp.currenTabCounter;
			   };
			   this.getAllTabs = function() {
				   return oProp.allTabs;
			   };
			   this.getAllProperties = function() {
				 return oProp;
			   };
			   this.switchTabByCounter = function(cnt) {
				   var totalTabs = oProp.allTabs;
				   oProp.currenTabCounter = cnt;
				   var tabid = totalTabs[oProp.currenTabCounter].id;
				   $this.switchTab(tabid);
			   };
			   this.getCurrenTabId = function() {
				   return  oProp.allTabs[oProp.currenTabCounter].id;
			   };
			   this.closeAll = function() {
				   //console.debug($("."+internalTabClassName).length);
				   $("."+internalTabClassName).hide();
				   $("."+internalTabPointers).removeClass(settings.selected);
			   };
			   this.getClosest = function(cls) {
				   //alert("elementid "+elementid);
				   var css = (cls=="undefined") ? "" : cls;
				   return $("#"+elementid).closest(css);
			   };
			   this.addCloseAllHandler = function(css, callback) {
				   $(css).bind("click", function() {
																				if(typeof(callback)!='undefined') {
																					//alert(callback);
																					eval(callback)($this);
																				};
																				$this.closeAll();
																				});
			   };
			   this.getCurrenContentId = function() {
				   var tabId = this.getCurrenTabId();
				   return tabId+settings.contentSuffix;
			   };			   
			   this.loadFile = function(loadURL, whereToUpdate, refreh) {
				   var url = loadURL;
				   var uploadDivTab = whereToUpdate; //THIS IS TAB ID
				   var contentid = getContentId(uploadDivTab);
				   //chek if already loaded;
				   if(typeof(cacheData[uploadDivTab]) == "undefined" && settings.cache==true) {
					  // $("#"+contentid).html("Please wait...");
					   $.ajax({
						   url:url,
						   type:'post',
						   success: function(res){
								$("#"+contentid).html(res);
								cacheData[uploadDivTab] = res;
								if(settings.callbackAfterDynamic != '') {
									eval(settings.callbackAfterDynamic)($this, arguments);
									//settings.callbackAfterDynamic.call(this, arguments);
								};
							}, 
							error: function(res) {
								var error = "<span class='error'>Error: "+res.statusText+"</span>";
								$("#"+contentid).html(error);
								eval(settings.callbackAfterDynamic)($this, arguments);
							}
					   });
				   };
			   };
			   this.getTabHolder = function() {
					 return $("#"+elementid);  
			    };
			    this.getVersion = function() {
					 return $.msTabs.version;
				};
			   //init;
			   init();
		   };
		$.msTabs = { 
				version: '2.5',
				author: "Marghoob Suleman",
				counter:20,
				create: function(id, opt) {
					return $(id).msMyTabs(opt).data("msTabs");
				}
		};
	   $.fn.extend({
		   msTabs: function(options)
	        {
	            return this.each(function()
	            {
	               //if ($(this).data('dd')) return; // need to comment when using refresh method - will remove in next version
	               var obj = new msMyTabs(this, options);
	               $(this).data('msTabs', obj);
	            });
	        }
   });
	//fixed for prop
	if(typeof($.fn.prop)=='undefined') {
		$.fn.prop = function(w, v) {
			if(typeof v == "undefined") {
				return $(this).attr(w);
			};
			try {
				$(this).attr(w, v);
			} catch(e) {
				//some properties are read only.
			};
		};
	};
   })(jQuery);