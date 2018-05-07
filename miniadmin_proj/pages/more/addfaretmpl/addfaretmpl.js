var utils = require('../../../utils/util.js');
var city = require('../../../utils/citys.js');
var app = getApp();
Page({
    data: {
        list: null,
        type: 'add',
        title: '',
        id: 0,
        list2: null,
        level1: null,
        level2: null,
        checked: null,
        showsel: false,
        allchecked: null,
        currentIndex: -1
    },
    onLoad: function(e) {
        var _shopid = wx.getStorageSync('shopid');
        var that = this;
        if (e.type == 'edit') {
            this.setData({
                type: 'edit',
                id: e.id
            });
        }
        var citys = city.allcitys;

        this.setData({
            list2: citys,
            showsel: false
        });

        if (e.type == 'add') {
            var _list = [];
            _list[0] = { 'index': 1, 'money': 0 };

            that.setData({
                list: _list
            });
        } else if (e.type == 'edit') {
            var params = { fareid: e.id, shopid: _shopid };
            utils.ajaxRequest(
                // 'shopMobile/faretmpl/get',
                'shopMobile/faretmpl/showFaretmpl',
                params,
                function(res) {
                    console.log('单个运费模板');
                    console.log(res);
                    var _title = res.data.content.title;
                    var _list = res.data.content.list;
                    var _allchecked = {};
                    var newlist = [];
                    for (var i = 0; i < _list.length; i++) {
                        var item = _list[i];
                        newlist[newlist.length] = { 'index': i + 1, 'money': item.money, "ids": item.ids, "titles": item.titles, "distitles": item.distitles };

                        if (item.ids == null) {
                            item.ids = ''
                        }
                        var ids = item.ids.split(",");
                        for (var j = 0; j < ids.length; j++) {
                            _allchecked[ids[j]] = true;
                        }
                    }

                    that.setData({
                        title: _title,
                        list: newlist,
                        allchecked: _allchecked
                    });
                });
        }

    },
    click1: function(e) {
        var id = e.currentTarget.dataset.id;

        var _level1 = this.data.level1 == null ? [] : this.data.level1;
        if (_level1[id] == 1) _level1[id] = 0;
        else _level1[id] = 1;
        this.setData({
            level1: _level1
        });
    },
    click2: function(e) {
        var id = e.currentTarget.dataset.id;

        var _level2 = this.data.level2 == null ? {} : this.data.level2;
        if (_level2[id] == 1) _level2[id] = 0;
        else _level2[id] = 1;
        this.setData({
            level2: _level2
        });
    },
    checkboxChange: function(e) {
        var _checked = {};
        var checkedlist = e.detail.value;
        for (var i = 0; i < checkedlist.length; i++) {
            var check = checkedlist[i];
            _checked[check] = true;
        }

        this.setData({
            checked: _checked
        });
    },
    delitem: function(e) {
        var that = this;
        var index = e.target.dataset.index - 1;
        var _list = that.data.list;
        var newlist = [];

        var ids = e.target.dataset.ids;
        var _checked = {};
        var _allchecked = this.data.allchecked;

        if (ids != null) {
            ids = ids.split(",");
            for (var i = 0; i < ids.length; i++) {
                _checked[ids[i]] = true;
                _allchecked[ids[i]] = false;
            }
        }

        if (_list.length == 1) { //只剩一个模版的时候进行提示
            wx.showModal({
                title: '提示',
                content: '运费模版中至少保留一个配送区域，否则买家购买时只能选择到店自提',
                showCancel: false,
                success: function(res) {
                    for (var i = 0; i < _list.length; i++) {
                        if (i != index) newlist[newlist.length] = _list[i];
                    }
                    for (var i = 0; i < newlist.length; i++) {
                        newlist[i].index = i + 1;
                    }
                    that.setData({
                        list: newlist
                    })

                }
            });

        } else {
            for (var i = 0; i < _list.length; i++) {
                if (i != index) newlist[newlist.length] = _list[i];
            }
            for (var i = 0; i < newlist.length; i++) {
                newlist[i].index = i + 1;
            }
            that.setData({
                list: newlist
            })
        }

    },
    confirmsel: function() {
        this.setData({
            showsel: false
        });
        var _l = this.data.checked;
        if (this.data.allchecked == null) {
            this.setData({
                allchecked: _l
            });

        } else {
            var _list = this.data.allchecked;
            for (var o in _l) {
                _list[o] = _l[o];
            }
            this.setData({
                allchecked: _list
            });
        }
        var ids = [];
        var titles = [];
        var distitles = [];
        for (var o in _l) {
            ids[ids.length] = o;
            var os = o.split("_");

            var titlestr = '';
            var distitlestr = '';
            if (os.length == 2) {
                titlestr = this.data.list2['0'][os[1]] + ",,";
                distitlestr = this.data.list2['0'][os[1]];
            }
            if (os.length == 3) {
                titlestr = this.data.list2['0'][os[1]] + "," + this.data.list2['0_' + os[1]][os[2]] + ",";
                distitlestr = this.data.list2['0_' + os[1]][os[2]];
            }
            if (os.length == 4) {
                titlestr = this.data.list2['0'][os[1]] + "," + this.data.list2['0_' + os[1]][os[2]] + "," + this.data.list2['0_' + os[1] + '_' + os[2]][os[3]];
                distitlestr = this.data.list2['0_' + os[1]][os[2]] + "[" + this.data.list2['0_' + os[1] + '_' + os[2]][os[3]] + "]"
            }
            titles[titles.length] = titlestr;
            distitles[distitles.length] = distitlestr;
        }
        var idsstr = ids.join(",");
        var titlesstr = titles.join("|");
        var distitlesstr = distitles.join(",");
        var _list = this.data.list;
        _list[this.data.currentIndex]['ids'] = idsstr;
        _list[this.data.currentIndex]['titles'] = titlesstr;
        _list[this.data.currentIndex]['distitles'] = distitlesstr;
        this.setData({
            list: _list
        });

    },
    tapAreaname: function(e) {
        var index = e.target.dataset.index - 1;
        var ids = e.target.dataset.ids;
        var _checked = {};
        var _allchecked = this.data.allchecked;

        if (ids != null) {
            ids = ids.split(",");
            for (var i = 0; i < ids.length; i++) {
                _checked[ids[i]] = true;
                _allchecked[ids[i]] = false;
            }
        }
        this.setData({
            showsel: true,
            checked: _checked,
            allchecked: _allchecked,
            currentIndex: index
        });
    },

    bindMoney: function(e) {
        var index = e.target.dataset.index - 1;
        var _list = this.data.list;
        _list[index].money = e.detail.value;
        this.setData({
            list: _list
        })
    },
    addnew: function() {
        var _list = this.data.list;
        var size = _list.length;
        console.log(_list)
        _list[size] = { 'index': size + 1, 'money': 0 };

        this.setData({
            list: _list
        });
    },
    formSubmit: function(e) {

        var _title = e.detail.value.title;
        var _list = this.data.list;
        var _data = JSON.stringify(this.data.list);

        if (_title == '') {
            wx.showModal({
                title: '提示',
                content: '请填写模板名称',
                showCancel: false,
                success: function(res) {

                }
            });
            return;
        }

        for (var i = 0; i < _list.length; i++) {
            if (_list[i].distitles == '' || _list[i].distitles == null || _list[i].distitles == 'undefined') {
                wx.showModal({
                    title: '提示',
                    content: '请选择配送地区',
                    showCancel: false,
                    success: function(res) {

                    }
                });
                return;

            }
        }

        var _shopid = wx.getStorageSync('shopid');
        var type = this.data.type;
        if (type == 'add') {
            var params = { data: encodeURIComponent(_data), title: encodeURIComponent(_title), shopid: _shopid, type: '1' };
            utils.ajaxRequest(
                'shopMobile/faretmpl/add',
                params,
                function(res) {
                    if (res.data.status == 1) {
                        wx.navigateBack({
                            delta: 1
                        })
                    } else {
                        wx.showModal({
                            title: '提示',
                            showCancel: false,
                            content: res.data.msg,
                            success: function(res) {}
                        });
                    }
                });
        } else if (type == 'edit') {
            var _id = this.data.id;
            var params = { data: encodeURIComponent(_data), title: encodeURIComponent(_title), shopid: _shopid, id: _id, type: '1' };
            utils.ajaxRequest(
                'shopMobile/faretmpl/update',
                params,
                function(res) {
                    if (res.data.status == 1) {
                        wx.navigateBack({
                            delta: 1
                        })
                    } else {
                        wx.showModal({
                            title: '提示',
                            showCancel: false,
                            content: res.data.msg,
                            success: function(res) {}
                        });
                    }
                });
        }


    }

})