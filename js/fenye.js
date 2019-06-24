/**
 * Created by web on 2019/6/10.
 */
$(function () {
    tabPage({
        pageMain: '#pageMain',
        pageNav: '#pageNav',
        pagePrev: '#prev',
        pageNext: '#next',
        curNum: 7, /*ÿҳ��ʾ������*/
        activeClass: 'active', /*������ʾ��class*/
        ini: 0/*��ʼ����ʾ��ҳ��*/
    });
    function tabPage(tabPage) {
        var pageMain = $(tabPage.pageMain);
        /*��ȡ�����б�*/
        var pageNav = $(tabPage.pageNav);
        /*��ȡ��ҳ*/
        var pagePrev = $(tabPage.pagePrev);
        /*��һҳ*/
        var pageNext = $(tabPage.pageNext);
        /*��һҳ*/


        var curNum = tabPage.curNum;
        /*ÿҳ��ʾ��*/
        var len = Math.ceil(pageMain.find("li").length / curNum);
        /*������ҳ��*/
        console.log(len);
        var pageList = '';
        /*����ҳ��*/
        var iNum = 0;
        /*��ǰ������ֵ*/

        for (var i = 0; i < len; i++) {
            pageList += '<a href="javascript:;">' + (i + 1) + '</a>';
        }
        pageNav.html(pageList);
        /*ͷһҳ�Ӹ�����ʾ*/
        pageNav.find("a:first").addClass(tabPage.activeClass);

        /*******��ǩҳ�ĵ���¼�*******/
        pageNav.find("a").each(function(){
            $(this).click(function () {
                pageNav.find("a").removeClass(tabPage.activeClass);
                $(this).addClass(tabPage.activeClass);
                iNum = $(this).index();
                $(pageMain).find("li").hide();
                for (var i = ($(this).html() - 1) * curNum; i < ($(this).html()) * curNum; i++) {
                    $(pageMain).find("li").eq(i).show()
                }

            });
        })


        $(pageMain).find("li").hide();
        /************��ҳ����ʾ*********/
        for (var i = 0; i < curNum; i++) {
            $(pageMain).find("li").eq(i).show()
        }


        /*��һҳ*/
        pageNext.click(function () {
            $(pageMain).find("li").hide();
            if (iNum == len - 1) {
                alert('�Ѿ������һҳ');
                for (var i = (len - 1) * curNum; i < len * curNum; i++) {
                    $(pageMain).find("li").eq(i).show()
                }
                return false;
            } else {
                pageNav.find("a").removeClass(tabPage.activeClass);
                iNum++;
                pageNav.find("a").eq(iNum).addClass(tabPage.activeClass);
//                    ini(iNum);
            }
            for (var i = iNum * curNum; i < (iNum + 1) * curNum; i++) {
                $(pageMain).find("li").eq(i).show()
            }
        });
        /*��һҳ*/
        pagePrev.click(function () {
            $(pageMain).find("li").hide();
            if (iNum == 0) {
                alert('��ǰ�ǵ�һҳ');
                for (var i = 0; i < curNum; i++) {
                    $(pageMain).find("li").eq(i).show()
                }
                return false;
            } else {
                pageNav.find("a").removeClass(tabPage.activeClass);
                iNum--;
                pageNav.find("a").eq(iNum).addClass(tabPage.activeClass);
            }
            for (var i = iNum * curNum; i < (iNum + 1) * curNum; i++) {
                $(pageMain).find("li").eq(i).show()
            }
        })

    }


})