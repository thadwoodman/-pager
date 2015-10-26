$(function(){

  //FILL TIL SPILL STRATEGY
  window.PageFlow = (function () {


    var PageFlow = {}

    PageFlow.pagify = function(){
      // set the canvas, make page, find first el to set
      PageFlow.makeCanvas();
      var page = PageFlow.makePage();
      //find next child
      var el = PageFlow.nextEl();
      //copy and append if not overflowing
      PageFlow.fillPage(page.data().pageNumber, el);
    }

    //capture content source
    PageFlow.contentSource = $('[data-flow="source"]');

    //create a hash of all the children
    PageFlow.contentIndex = {}
    PageFlow.contentSource.children().each(function(i){
      PageFlow.contentIndex[i] = this;
    })

    //hide source
    PageFlow.contentSource.hide();

    //capture target
    PageFlow.target = $('[data-flow="target"]');


    //set default attribtues
    PageFlow.pageAttributes = {
      height: 450,
      width: 300
    }

    PageFlow.makeCanvas = function(){
      //makes backdrop etc..
      if ($('[data-behavior=page-container]').length == 0){
        var pageContainer = $('<div>')
          .addClass('page-container')
          .css({
            position: 'absolute',
            background: 'rgba(1,1,1,.7)',
            height: '100%',
            width: '100%',
            margin: '0', 
            left: '0'
          })
          .attr('data-behavior', 'page-container')
          .appendTo($('body'));
      }
      //update page attribtues
      PageFlow.pageAttributes.height = pageContainer.height() * .9
      PageFlow.pageAttributes.width  = pageContainer.height() * (2/3)
    }

    PageFlow.makePage = function(){
      // 
      var pageCount = $('[data-behavior=page]').length
      var template = $('<div>')
        .addClass('page')
        .css({
          height: PageFlow.pageAttributes.height,
          width: PageFlow.pageAttributes.width,
          margin: '10px auto',
          padding: '20px'
        })
        .attr({'data-behavior': 'page', 'data-page-number': (pageCount + 1) })
      $('[data-behavior=page-container]').append(template);
      return template;
    }

    // keeps track of where we are in the index
    PageFlow.contentIndexLocation = 0

    PageFlow.nextEl = function(){
      return  PageFlow.contentIndex[PageFlow.contentIndexLocation];
    }

    //save appended locatin of content index
    PageFlow.fillPage = function(pageId, el){
        var self = this;
        self.page = $('[data-page-number='+ pageId +']')
        self.pageHeight = self.page.innerHeight();
        // how tall is the new page with appended el?
        function availableSpace(){
          if ($(self.page).children().length){
            var totalHeight = 0;
            self.page.children().each(function(){
                totalHeight = totalHeight + $(this).outerHeight(true);
            });
            return self.page.innerHeight() - totalHeight;
          } 
          else{
            return self.pageHeight;
          }
        }
        PageFlow.appendContent(el, self.page)
        if (availableSpace() > 0 ){
          if (el.textContent){          
            var fittedElement = PageFlow.fitTextElement(el, availableSpace());
            $(el).html(fittedElement.content)
            if (fittedElement.overflow.length) {
              // make a new page
              var page = PageFlow.makePage();
              // make copy of parent el and insert overflow
              var overflow = $(el).clone()
              PageFlow.fillPage(pageId, overflow.html(fittedElement.overflow))
            }
            else{
              PageFlow.contentIndexLocation++
              PageFlow.fillPage(pageId, PageFlow.nextEl());
            }
          }
        }
        else{
          console.log('no more space! make new page')
          self.page = PageFlow.makePage();
        }
      }

    PageFlow.appendContent = function(content, page){
      $(page).append($(content));
    } 

    PageFlow.fitTextElement = function(el, availableSpace){
      //how many lines will fit
      var ftdEl = {};
      ftdEl.availableSpace = availableSpace;
      ftdEl.text = el.textContent;
      ftdEl.lineCount = (el.textContent.match(/\n/g)||[]).length;
      ftdEl.elHeight = el.offsetHeight;
      ftdEl.lineHeight = ftdEl.elHeight / ftdEl.lineCount;
      ftdEl.linesThatFit = Math.floor(availableSpace / ftdEl.lineHeight);
      ftdEl.splitLines = $(el.textContent.split(/\n/g)||[]);
      ftdEl.content = [].slice.call(ftdEl.splitLines, 0, ftdEl.linesThatFit).join('\n');
      ftdEl.overflow = [].slice.call(ftdEl.splitLines, ftdEl.linesThatFit, ftdEl.splitLines.length).join('\n');
      console.log(ftdEl)
      return ftdEl;
    }

    // return PageFlow objy
    return PageFlow;
  }());


  
  // capture root env
  var root = this;



  //COLUMN IDEA
  // makeColumns();

  // var makeColumns = function(){
  //   var content = $('[data-behavior='pageable']');
  //   content.css({
  //     'height': '900px',
  //     'width': '600px',
  //     'overflow': 'scroll',
  //     '-webkit-column-width': '600px',
  //     'column-width': '600px'    
  //   });
  // }

})