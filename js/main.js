$(function(){

  //FILL TIL SPILL STRATEGY
  window.PageFlow = (function () {


    var PageFlow = {}

    rangy.init();

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

    PageFlow.makePageContainer = function(){
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

    PageFlow.makePageTemplate = function(){
      var pageCount = $('[data-behavior=page]').length
       return $('<div>')
        .addClass('page')
        .css({
          height: PageFlow.pageAttributes.height,
          width: PageFlow.pageAttributes.width,
          margin: '10px auto',
          padding: '20px'
        })
        .attr({'data-behavior': 'page', 'data-page-number': (pageCount + 1) })
        .appendTo($('[data-behavior=page-container]'));
    }

    // keeps track of where we are in the index
    PageFlow.contentIndexLocation = 0

    PageFlow.fillPages = function(){
        var self = this;
        var page = $('[data-behavior=page]').first();
        //find next child
        var el = PageFlow.contentIndex[PageFlow.contentIndexLocation];
        //copy and append if not overflowing
        PageFlow.fillPage(page, el);
    }
       
      //save appended locatin of content index
    PageFlow.fillPage = function(page, el){
        var pageHeight = page.innerHeight();
        // how tall is the new page with appended el?
        if ($(page).children().length){
          var availableSpace = page.innerHeight - $(page).children().height();
        } 
        else{
          var availableSpace = pageHeight
        }

        if (availableSpace){
          PageFlow.appendContent(el, page)
          if (el.textContent){          
            var fittedElement = PageFlow.fitTextElement(el, availableSpace);
            console.log(fittedElement);
            $(el).html(fittedElement.content)
            if (fittedElement.overflow.length) {
              // make a new page
              var page = PageFlow.makePageTemplate();
              // make copy of parent el and insert overflow
              var overflow = $(el).clone()
              PageFlow.fillPage(page, overflow.html(fittedElement.overflow))
            }
            else{
              PageFlow.contentIndexLocation++
            }
          }
        }
        else{
          var page = PageFlow.makePageTemplate();
          console.log('success!')
        }
      }

    PageFlow.appendContent = function(content, page){
      $(page).append($(content));
    } 

    PageFlow.fitTextElement = function(el, availableSpace){
      //how many lines will fit

      this.lineCount = (el.textContent.match(/\n/g)||[]).length;
      var elHeight = el.offsetHeight
      var lineHeight = elHeight / this.lineCount;
      var linesThatFit = Math.floor(availableSpace / lineHeight);
      var splitLines = $(el.textContent.split(/\n/g)||[]);
      console.log('slice length '+[].slice.call(splitLines, 0, linesThatFit).length)
      console.log(
        'availableSpace: ' + availableSpace + '\n' +
        'linecount: ' + this.lineCount + '\n' +
        'element height: ' + elHeight + '\n' +
        'lines to keep: ' + linesThatFit + '\n' + 
        'line array: ' + linesThatFit + '\n' + 
        'line height * lines: ' + (lineHeight * this.lineCount) + '\n' + 
        ''
      )
      var content = [].slice.call(splitLines, 0, linesThatFit).join('\n');
      var overflow = [].slice.call(splitLines, linesThatFit, splitLines.length).join('\n');
      return {
        content: content,
        overflow: overflow
      }
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