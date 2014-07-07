var expect = chai.expect;

describe('Pjaxer', function(){
  describe('Pjaxer', function(){
    var pjaxer;

    context('when the browser doesn\'t support pjax', function(){
      beforeEach(function(){
        Pjaxer.isSupported = false;
        pjaxer = Pjaxer();
      });

      it('makes itself unavailable', function(){
        expect(pjaxer.isAvailable).to.be.falsy;
      });
    });

    context('when the browser supports pjax', function(){
      beforeEach(function(){
        Pjaxer.isSupported = true;
      });

      it('makes itself available', function(){
        expect(pjaxer.isAvailable).to.be.truthy;
      });
    });
  });

  describe('Ajax', function(){
  });
});
