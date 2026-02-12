/**
* @Description 紫微斗数排盘工具
* @charset UTF-8
* @Author  youxing(sing.you@126.com)
* @Time    2015-08-01 创建 by youxing
* @Time    2017-10-20 增加四柱信息显示 by youxing
* @Time    2025-10-05 增加单宫的四化飞出飞入信息 by youxing
* @Time    2025-11-15 增加获取坐命主星、辅星的单独方法 by youxing
* @Time    2025-11-20 获取坐命主星有bug，修复 by youxing
* @Time    2025-11-29 增加获得命宫主星信息，增加四化、自化星内容 by youxing
* @Time    2026-02-12 增加流年后计算各宫月命月份信息 by youxing
* @Time    2026-02-12 流月月份显示为正月等，流月以寅宫原局宫职定位正月，年妻改年夫，运妻改运夫 by youxing
* @Version 1.6
*/


/**
* @1900-2100区间内的公历、农历互转
* @charset UTF-8
* @Author  Jea杨(JJonline@JJonline.Cn)
* @Time    2014-7-21
* @Time    2016-8-13 Fixed 2033hex、Attribution Annals
* @Time    2016-9-25 Fixed lunar LeapMonth Param Bug
* @Time    2017-7-24 Fixed use getTerm Func Param Error.use solar year,NOT lunar year
* @Time    2017-10-20 增加时辰信息，即有四柱 add by youxing
* @Version 1.0.4
* @公历转农历：calendar.solar2lunar(1987,11,01); //[you can ignore params of prefix 0]
* @农历转公历：calendar.lunar2solar(1987,09,10); //[you can ignore params of prefix 0]
* @公历转农历：calendar.solar2lunar4(1987,11,01,02); 02即2点，add by youxing
*/
var calendar = {

    /**
      * 农历1900-2100的润大小信息表
      * @Array Of Property
      * @return Hex 
      */
    lunarInfo:[0x04bd8,0x04ae0,0x0a570,0x054d5,0x0d260,0x0d950,0x16554,0x056a0,0x09ad0,0x055d2,//1900-1909
            0x04ae0,0x0a5b6,0x0a4d0,0x0d250,0x1d255,0x0b540,0x0d6a0,0x0ada2,0x095b0,0x14977,//1910-1919
            0x04970,0x0a4b0,0x0b4b5,0x06a50,0x06d40,0x1ab54,0x02b60,0x09570,0x052f2,0x04970,//1920-1929
            0x06566,0x0d4a0,0x0ea50,0x06e95,0x05ad0,0x02b60,0x186e3,0x092e0,0x1c8d7,0x0c950,//1930-1939
            0x0d4a0,0x1d8a6,0x0b550,0x056a0,0x1a5b4,0x025d0,0x092d0,0x0d2b2,0x0a950,0x0b557,//1940-1949
            0x06ca0,0x0b550,0x15355,0x04da0,0x0a5b0,0x14573,0x052b0,0x0a9a8,0x0e950,0x06aa0,//1950-1959
            0x0aea6,0x0ab50,0x04b60,0x0aae4,0x0a570,0x05260,0x0f263,0x0d950,0x05b57,0x056a0,//1960-1969
            0x096d0,0x04dd5,0x04ad0,0x0a4d0,0x0d4d4,0x0d250,0x0d558,0x0b540,0x0b6a0,0x195a6,//1970-1979
            0x095b0,0x049b0,0x0a974,0x0a4b0,0x0b27a,0x06a50,0x06d40,0x0af46,0x0ab60,0x09570,//1980-1989
            0x04af5,0x04970,0x064b0,0x074a3,0x0ea50,0x06b58,0x055c0,0x0ab60,0x096d5,0x092e0,//1990-1999
            0x0c960,0x0d954,0x0d4a0,0x0da50,0x07552,0x056a0,0x0abb7,0x025d0,0x092d0,0x0cab5,//2000-2009
            0x0a950,0x0b4a0,0x0baa4,0x0ad50,0x055d9,0x04ba0,0x0a5b0,0x15176,0x052b0,0x0a930,//2010-2019
            0x07954,0x06aa0,0x0ad50,0x05b52,0x04b60,0x0a6e6,0x0a4e0,0x0d260,0x0ea65,0x0d530,//2020-2029
            0x05aa0,0x076a3,0x096d0,0x04afb,0x04ad0,0x0a4d0,0x1d0b6,0x0d250,0x0d520,0x0dd45,//2030-2039
            0x0b5a0,0x056d0,0x055b2,0x049b0,0x0a577,0x0a4b0,0x0aa50,0x1b255,0x06d20,0x0ada0,//2040-2049
            /**Add By JJonline@JJonline.Cn**/
            0x14b63,0x09370,0x049f8,0x04970,0x064b0,0x168a6,0x0ea50, 0x06b20,0x1a6c4,0x0aae0,//2050-2059
            0x0a2e0,0x0d2e3,0x0c960,0x0d557,0x0d4a0,0x0da50,0x05d55,0x056a0,0x0a6d0,0x055d4,//2060-2069
            0x052d0,0x0a9b8,0x0a950,0x0b4a0,0x0b6a6,0x0ad50,0x055a0,0x0aba4,0x0a5b0,0x052b0,//2070-2079
            0x0b273,0x06930,0x07337,0x06aa0,0x0ad50,0x14b55,0x04b60,0x0a570,0x054e4,0x0d160,//2080-2089
            0x0e968,0x0d520,0x0daa0,0x16aa6,0x056d0,0x04ae0,0x0a9d4,0x0a2d0,0x0d150,0x0f252,//2090-2099
            0x0d520],//2100

    /**
      * 公历每个月份的天数普通表
      * @Array Of Property
      * @return Number 
      */
    solarMonth:[31,28,31,30,31,30,31,31,30,31,30,31],

    /**
      * 天干地支之天干速查表
      * @Array Of Property trans["甲","乙","丙","丁","戊","己","庚","辛","壬","癸"]
      * @return Cn string 
      */
    Gan:["\u7532","\u4e59","\u4e19","\u4e01","\u620a","\u5df1","\u5e9a","\u8f9b","\u58ec","\u7678"],

    /**
      * 天干地支之地支速查表
      * @Array Of Property 
      * @trans["子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥"]
      * @return Cn string 
      */
    Zhi:["\u5b50","\u4e11","\u5bc5","\u536f","\u8fb0","\u5df3","\u5348","\u672a","\u7533","\u9149","\u620c","\u4ea5"],

    /**
      * 天干地支之地支速查表<=>生肖
      * @Array Of Property 
      * @trans["鼠","牛","虎","兔","龙","蛇","马","羊","猴","鸡","狗","猪"]
      * @return Cn string 
      */
    Animals:["\u9f20","\u725b","\u864e","\u5154","\u9f99","\u86c7","\u9a6c","\u7f8a","\u7334","\u9e21","\u72d7","\u732a"],

    /**
      * 24节气速查表
      * @Array Of Property 
      * @trans["小寒","大寒","立春","雨水","惊蛰","春分","清明","谷雨","立夏","小满","芒种","夏至","小暑","大暑","立秋","处暑","白露","秋分","寒露","霜降","立冬","小雪","大雪","冬至"]
      * @return Cn string 
      */
    solarTerm:["\u5c0f\u5bd2","\u5927\u5bd2","\u7acb\u6625","\u96e8\u6c34","\u60ca\u86f0","\u6625\u5206","\u6e05\u660e","\u8c37\u96e8","\u7acb\u590f","\u5c0f\u6ee1","\u8292\u79cd","\u590f\u81f3","\u5c0f\u6691","\u5927\u6691","\u7acb\u79cb","\u5904\u6691","\u767d\u9732","\u79cb\u5206","\u5bd2\u9732","\u971c\u964d","\u7acb\u51ac","\u5c0f\u96ea","\u5927\u96ea","\u51ac\u81f3"],

    /**
      * 1900-2100各年的24节气日期速查表
      * @Array Of Property 
      * @return 0x string For splice
      */
    sTermInfo:['9778397bd097c36b0b6fc9274c91aa','97b6b97bd19801ec9210c965cc920e','97bcf97c3598082c95f8c965cc920f',
              '97bd0b06bdb0722c965ce1cfcc920f','b027097bd097c36b0b6fc9274c91aa','97b6b97bd19801ec9210c965cc920e',
              '97bcf97c359801ec95f8c965cc920f','97bd0b06bdb0722c965ce1cfcc920f','b027097bd097c36b0b6fc9274c91aa',
              '97b6b97bd19801ec9210c965cc920e','97bcf97c359801ec95f8c965cc920f','97bd0b06bdb0722c965ce1cfcc920f',
              'b027097bd097c36b0b6fc9274c91aa','9778397bd19801ec9210c965cc920e','97b6b97bd19801ec95f8c965cc920f',
              '97bd09801d98082c95f8e1cfcc920f','97bd097bd097c36b0b6fc9210c8dc2','9778397bd197c36c9210c9274c91aa',
              '97b6b97bd19801ec95f8c965cc920e','97bd09801d98082c95f8e1cfcc920f','97bd097bd097c36b0b6fc9210c8dc2',
              '9778397bd097c36c9210c9274c91aa','97b6b97bd19801ec95f8c965cc920e','97bcf97c3598082c95f8e1cfcc920f',
              '97bd097bd097c36b0b6fc9210c8dc2','9778397bd097c36c9210c9274c91aa','97b6b97bd19801ec9210c965cc920e',
              '97bcf97c3598082c95f8c965cc920f','97bd097bd097c35b0b6fc920fb0722','9778397bd097c36b0b6fc9274c91aa',
              '97b6b97bd19801ec9210c965cc920e','97bcf97c3598082c95f8c965cc920f','97bd097bd097c35b0b6fc920fb0722',
              '9778397bd097c36b0b6fc9274c91aa','97b6b97bd19801ec9210c965cc920e','97bcf97c359801ec95f8c965cc920f',
              '97bd097bd097c35b0b6fc920fb0722','9778397bd097c36b0b6fc9274c91aa','97b6b97bd19801ec9210c965cc920e',
              '97bcf97c359801ec95f8c965cc920f','97bd097bd097c35b0b6fc920fb0722','9778397bd097c36b0b6fc9274c91aa',
              '97b6b97bd19801ec9210c965cc920e','97bcf97c359801ec95f8c965cc920f','97bd097bd07f595b0b6fc920fb0722',
              '9778397bd097c36b0b6fc9210c8dc2','9778397bd19801ec9210c9274c920e','97b6b97bd19801ec95f8c965cc920f',
              '97bd07f5307f595b0b0bc920fb0722','7f0e397bd097c36b0b6fc9210c8dc2','9778397bd097c36c9210c9274c920e',
              '97b6b97bd19801ec95f8c965cc920f','97bd07f5307f595b0b0bc920fb0722','7f0e397bd097c36b0b6fc9210c8dc2',
              '9778397bd097c36c9210c9274c91aa','97b6b97bd19801ec9210c965cc920e','97bd07f1487f595b0b0bc920fb0722',
              '7f0e397bd097c36b0b6fc9210c8dc2','9778397bd097c36b0b6fc9274c91aa','97b6b97bd19801ec9210c965cc920e',
              '97bcf7f1487f595b0b0bb0b6fb0722','7f0e397bd097c35b0b6fc920fb0722','9778397bd097c36b0b6fc9274c91aa',
              '97b6b97bd19801ec9210c965cc920e','97bcf7f1487f595b0b0bb0b6fb0722','7f0e397bd097c35b0b6fc920fb0722',
              '9778397bd097c36b0b6fc9274c91aa','97b6b97bd19801ec9210c965cc920e','97bcf7f1487f531b0b0bb0b6fb0722',
              '7f0e397bd097c35b0b6fc920fb0722','9778397bd097c36b0b6fc9274c91aa','97b6b97bd19801ec9210c965cc920e',
              '97bcf7f1487f531b0b0bb0b6fb0722','7f0e397bd07f595b0b6fc920fb0722','9778397bd097c36b0b6fc9274c91aa',
              '97b6b97bd19801ec9210c9274c920e','97bcf7f0e47f531b0b0bb0b6fb0722','7f0e397bd07f595b0b0bc920fb0722',
              '9778397bd097c36b0b6fc9210c91aa','97b6b97bd197c36c9210c9274c920e','97bcf7f0e47f531b0b0bb0b6fb0722',
              '7f0e397bd07f595b0b0bc920fb0722','9778397bd097c36b0b6fc9210c8dc2','9778397bd097c36c9210c9274c920e',
              '97b6b7f0e47f531b0723b0b6fb0722','7f0e37f5307f595b0b0bc920fb0722','7f0e397bd097c36b0b6fc9210c8dc2',
              '9778397bd097c36b0b70c9274c91aa','97b6b7f0e47f531b0723b0b6fb0721','7f0e37f1487f595b0b0bb0b6fb0722',
              '7f0e397bd097c35b0b6fc9210c8dc2','9778397bd097c36b0b6fc9274c91aa','97b6b7f0e47f531b0723b0b6fb0721',
              '7f0e27f1487f595b0b0bb0b6fb0722','7f0e397bd097c35b0b6fc920fb0722','9778397bd097c36b0b6fc9274c91aa',
              '97b6b7f0e47f531b0723b0b6fb0721','7f0e27f1487f531b0b0bb0b6fb0722','7f0e397bd097c35b0b6fc920fb0722',
              '9778397bd097c36b0b6fc9274c91aa','97b6b7f0e47f531b0723b0b6fb0721','7f0e27f1487f531b0b0bb0b6fb0722',
              '7f0e397bd097c35b0b6fc920fb0722','9778397bd097c36b0b6fc9274c91aa','97b6b7f0e47f531b0723b0b6fb0721',
              '7f0e27f1487f531b0b0bb0b6fb0722','7f0e397bd07f595b0b0bc920fb0722','9778397bd097c36b0b6fc9274c91aa',
              '97b6b7f0e47f531b0723b0787b0721','7f0e27f0e47f531b0b0bb0b6fb0722','7f0e397bd07f595b0b0bc920fb0722',
              '9778397bd097c36b0b6fc9210c91aa','97b6b7f0e47f149b0723b0787b0721','7f0e27f0e47f531b0723b0b6fb0722',
              '7f0e397bd07f595b0b0bc920fb0722','9778397bd097c36b0b6fc9210c8dc2','977837f0e37f149b0723b0787b0721',
              '7f07e7f0e47f531b0723b0b6fb0722','7f0e37f5307f595b0b0bc920fb0722','7f0e397bd097c35b0b6fc9210c8dc2',
              '977837f0e37f14998082b0787b0721','7f07e7f0e47f531b0723b0b6fb0721','7f0e37f1487f595b0b0bb0b6fb0722',
              '7f0e397bd097c35b0b6fc9210c8dc2','977837f0e37f14998082b0787b06bd','7f07e7f0e47f531b0723b0b6fb0721',
              '7f0e27f1487f531b0b0bb0b6fb0722','7f0e397bd097c35b0b6fc920fb0722','977837f0e37f14998082b0787b06bd',
              '7f07e7f0e47f531b0723b0b6fb0721','7f0e27f1487f531b0b0bb0b6fb0722','7f0e397bd097c35b0b6fc920fb0722',
              '977837f0e37f14998082b0787b06bd','7f07e7f0e47f531b0723b0b6fb0721','7f0e27f1487f531b0b0bb0b6fb0722',
              '7f0e397bd07f595b0b0bc920fb0722','977837f0e37f14998082b0787b06bd','7f07e7f0e47f531b0723b0b6fb0721',
              '7f0e27f1487f531b0b0bb0b6fb0722','7f0e397bd07f595b0b0bc920fb0722','977837f0e37f14998082b0787b06bd',
              '7f07e7f0e47f149b0723b0787b0721','7f0e27f0e47f531b0b0bb0b6fb0722','7f0e397bd07f595b0b0bc920fb0722',
              '977837f0e37f14998082b0723b06bd','7f07e7f0e37f149b0723b0787b0721','7f0e27f0e47f531b0723b0b6fb0722',
              '7f0e397bd07f595b0b0bc920fb0722','977837f0e37f14898082b0723b02d5','7ec967f0e37f14998082b0787b0721',
              '7f07e7f0e47f531b0723b0b6fb0722','7f0e37f1487f595b0b0bb0b6fb0722','7f0e37f0e37f14898082b0723b02d5',
              '7ec967f0e37f14998082b0787b0721','7f07e7f0e47f531b0723b0b6fb0722','7f0e37f1487f531b0b0bb0b6fb0722',
              '7f0e37f0e37f14898082b0723b02d5','7ec967f0e37f14998082b0787b06bd','7f07e7f0e47f531b0723b0b6fb0721',
              '7f0e37f1487f531b0b0bb0b6fb0722','7f0e37f0e37f14898082b072297c35','7ec967f0e37f14998082b0787b06bd',
              '7f07e7f0e47f531b0723b0b6fb0721','7f0e27f1487f531b0b0bb0b6fb0722','7f0e37f0e37f14898082b072297c35',
              '7ec967f0e37f14998082b0787b06bd','7f07e7f0e47f531b0723b0b6fb0721','7f0e27f1487f531b0b0bb0b6fb0722',
              '7f0e37f0e366aa89801eb072297c35','7ec967f0e37f14998082b0787b06bd','7f07e7f0e47f149b0723b0787b0721',
              '7f0e27f1487f531b0b0bb0b6fb0722','7f0e37f0e366aa89801eb072297c35','7ec967f0e37f14998082b0723b06bd',
              '7f07e7f0e47f149b0723b0787b0721','7f0e27f0e47f531b0723b0b6fb0722','7f0e37f0e366aa89801eb072297c35',
              '7ec967f0e37f14998082b0723b06bd','7f07e7f0e37f14998083b0787b0721','7f0e27f0e47f531b0723b0b6fb0722',
              '7f0e37f0e366aa89801eb072297c35','7ec967f0e37f14898082b0723b02d5','7f07e7f0e37f14998082b0787b0721',
              '7f07e7f0e47f531b0723b0b6fb0722','7f0e36665b66aa89801e9808297c35','665f67f0e37f14898082b0723b02d5',
              '7ec967f0e37f14998082b0787b0721','7f07e7f0e47f531b0723b0b6fb0722','7f0e36665b66a449801e9808297c35',
              '665f67f0e37f14898082b0723b02d5','7ec967f0e37f14998082b0787b06bd','7f07e7f0e47f531b0723b0b6fb0721',
              '7f0e36665b66a449801e9808297c35','665f67f0e37f14898082b072297c35','7ec967f0e37f14998082b0787b06bd',
              '7f07e7f0e47f531b0723b0b6fb0721','7f0e26665b66a449801e9808297c35','665f67f0e37f1489801eb072297c35',
              '7ec967f0e37f14998082b0787b06bd','7f07e7f0e47f531b0723b0b6fb0721','7f0e27f1487f531b0b0bb0b6fb0722'],

    /**
      * 数字转中文速查表
      * @Array Of Property 
      * @trans ['日','一','二','三','四','五','六','七','八','九','十']
      * @return Cn string 
      */
    nStr1:["\u65e5","\u4e00","\u4e8c","\u4e09","\u56db","\u4e94","\u516d","\u4e03","\u516b","\u4e5d","\u5341"],

    /**
      * 日期转农历称呼速查表
      * @Array Of Property 
      * @trans ['初','十','廿','卅']
      * @return Cn string 
      */
    nStr2:["\u521d","\u5341","\u5eff","\u5345"],

    /**
      * 月份转农历称呼速查表
      * @Array Of Property 
      * @trans ['正','一','二','三','四','五','六','七','八','九','十','冬','腊']
      * @return Cn string 
      */
    nStr3:["\u6b63","\u4e8c","\u4e09","\u56db","\u4e94","\u516d","\u4e03","\u516b","\u4e5d","\u5341","\u51ac","\u814a"],

    /**
      * 返回农历y年一整年的总天数
      * @param lunar Year
      * @return Number
      * @eg:var count = calendar.lYearDays(1987) ;//count=387
      */
    lYearDays:function(y) {
        var i, sum = 348;
        for(i=0x8000; i>0x8; i>>=1) { sum += (calendar.lunarInfo[y-1900] & i)? 1: 0; }
        return(sum+calendar.leapDays(y));
    },

    /**
      * 返回农历y年闰月是哪个月；若y年没有闰月 则返回0
      * @param lunar Year
      * @return Number (0-12)
      * @eg:var leapMonth = calendar.leapMonth(1987) ;//leapMonth=6
      */
    leapMonth:function(y) { //闰字编码 \u95f0
        return(calendar.lunarInfo[y-1900] & 0xf);
    },

    /**
      * 返回农历y年闰月的天数 若该年没有闰月则返回0
      * @param lunar Year
      * @return Number (0、29、30)
      * @eg:var leapMonthDay = calendar.leapDays(1987) ;//leapMonthDay=29
      */
    leapDays:function(y) {
        if(calendar.leapMonth(y))  { 
            return((calendar.lunarInfo[y-1900] & 0x10000)? 30: 29); 
        }
        return(0);
    },

    /**
      * 返回农历y年m月（非闰月）的总天数，计算m为闰月时的天数请使用leapDays方法
      * @param lunar Year
      * @return Number (-1、29、30)
      * @eg:var MonthDay = calendar.monthDays(1987,9) ;//MonthDay=29
      */
    monthDays:function(y,m) {
        if(m>12 || m<1) {return -1}//月份参数从1至12，参数错误返回-1
        return( (calendar.lunarInfo[y-1900] & (0x10000>>m))? 30: 29 );
    },

    /**
      * 返回公历(!)y年m月的天数
      * @param solar Year
      * @return Number (-1、28、29、30、31)
      * @eg:var solarMonthDay = calendar.leapDays(1987) ;//solarMonthDay=30
      */
    solarDays:function(y,m) {
        if(m>12 || m<1) {return -1} //若参数错误 返回-1
        var ms = m-1;
        if(ms==1) { //2月份的闰平规律测算后确认返回28或29
            return(((y%4 == 0) && (y%100 != 0) || (y%400 == 0))? 29: 28);
        }else {
            return(calendar.solarMonth[ms]);
        }
    },

    /**
     * 农历年份转换为干支纪年
     * @param  lYear 农历年的年份数
     * @return Cn string
     */
    toGanZhiYear:function(lYear) {
        var ganKey = (lYear - 3) % 10;
        var zhiKey = (lYear - 3) % 12;
        if(ganKey == 0) ganKey = 10;//如果余数为0则为最后一个天干
        if(zhiKey == 0) zhiKey = 12;//如果余数为0则为最后一个地支
        return calendar.Gan[ganKey-1] + calendar.Zhi[zhiKey-1];
        
    },

    /**
     * 公历月、日判断所属星座
     * @param  cMonth [description]
     * @param  cDay [description]
     * @return Cn string
     */
    toAstro:function(cMonth,cDay) {
        var s   = "\u9b54\u7faf\u6c34\u74f6\u53cc\u9c7c\u767d\u7f8a\u91d1\u725b\u53cc\u5b50\u5de8\u87f9\u72ee\u5b50\u5904\u5973\u5929\u79e4\u5929\u874e\u5c04\u624b\u9b54\u7faf";
        var arr = [20,19,21,21,21,22,23,23,23,23,22,22];
        return s.substr(cMonth*2 - (cDay < arr[cMonth-1] ? 2 : 0),2) + "\u5ea7";//座
    },

    /**
      * 传入offset偏移量返回干支
      * @param offset 相对甲子的偏移量
      * @return Cn string
      */
    toGanZhi:function(offset) {
        return calendar.Gan[offset%10] + calendar.Zhi[offset%12];
    },

    /**
      * 传入公历(!)y年获得该年第n个节气的公历日期
      * @param y公历年(1900-2100)；n二十四节气中的第几个节气(1~24)；从n=1(小寒)算起 
      * @return day Number
      * @eg:var _24 = calendar.getTerm(1987,3) ;//_24=4;意即1987年2月4日立春
      */
    getTerm:function(y,n) {
        if(y<1900 || y>2100) {return -1;}
        if(n<1 || n>24) {return -1;}
        var _table = calendar.sTermInfo[y-1900];
        var _info = [
            parseInt('0x'+_table.substr(0,5)).toString() ,
            parseInt('0x'+_table.substr(5,5)).toString(),
            parseInt('0x'+_table.substr(10,5)).toString(),
            parseInt('0x'+_table.substr(15,5)).toString(),
            parseInt('0x'+_table.substr(20,5)).toString(),
            parseInt('0x'+_table.substr(25,5)).toString()
        ];
        var _calday = [
            _info[0].substr(0,1),
            _info[0].substr(1,2),
            _info[0].substr(3,1),
            _info[0].substr(4,2),
            
            _info[1].substr(0,1),
            _info[1].substr(1,2),
            _info[1].substr(3,1),
            _info[1].substr(4,2),
            
            _info[2].substr(0,1),
            _info[2].substr(1,2),
            _info[2].substr(3,1),
            _info[2].substr(4,2),
            
            _info[3].substr(0,1),
            _info[3].substr(1,2),
            _info[3].substr(3,1),
            _info[3].substr(4,2),
            
            _info[4].substr(0,1),
            _info[4].substr(1,2),
            _info[4].substr(3,1),
            _info[4].substr(4,2),
            
            _info[5].substr(0,1),
            _info[5].substr(1,2),
            _info[5].substr(3,1),
            _info[5].substr(4,2),
        ];
        return parseInt(_calday[n-1]);
    },

    /**
      * 传入农历数字月份返回汉语通俗表示法
      * @param lunar month
      * @return Cn string
      * @eg:var cnMonth = calendar.toChinaMonth(12) ;//cnMonth='腊月'
      */
    toChinaMonth:function(m) { // 月 => \u6708
        if(m>12 || m<1) {return -1} //若参数错误 返回-1
        var s = calendar.nStr3[m-1];
        s+= "\u6708";//加上月字
        return s;
    },

    /**
      * 传入农历日期数字返回汉字表示法
      * @param lunar day
      * @return Cn string
      * @eg:var cnDay = calendar.toChinaDay(21) ;//cnMonth='廿一'
      */
    toChinaDay:function(d){ //日 => \u65e5
        var s;
        switch (d) {
            case 10:
            s = '\u521d\u5341'; break;
        case 20:
            s = '\u4e8c\u5341'; break;
            break;
        case 30:
            s = '\u4e09\u5341'; break;
            break;
        default :
            s = calendar.nStr2[Math.floor(d/10)];
            s += calendar.nStr1[d%10];
        }
        return(s);
    },

    /**
      * 年份转生肖[!仅能大致转换] => 精确划分生肖分界线是“立春”
      * @param y year
      * @return Cn string
      * @eg:var animal = calendar.getAnimal(1987) ;//animal='兔'
      */
    getAnimal: function(y) {
        return calendar.Animals[(y - 4) % 12]
    },

    /**
      * 传入阳历年月日获得详细的公历、农历object信息 <=>JSON
      * @param y  solar year
      * @param m  solar month
      * @param d  solar day
      * @return JSON object
      * @eg:console.log(calendar.solar2lunar(1987,11,01));
      */
    solar2lunar:function (y,m,d) { //参数区间1900.1.31~2100.12.31
        //年份限定、上限
        if(y<1900 || y>2100) {
            return -1;// undefined转换为数字变为NaN
        }
        //公历传参最下限
        if(y==1900&&m==1&&d<31) {
            return -1;
        }
        //未传参  获得当天
        if(!y) {
            var objDate = new Date();
        }else {
            var objDate = new Date(y,parseInt(m)-1,d)
        }
        var i, leap=0, temp=0;
        //修正ymd参数
        var y = objDate.getFullYear(),
            m = objDate.getMonth()+1,
            d = objDate.getDate();
        var offset = (Date.UTC(objDate.getFullYear(),objDate.getMonth(),objDate.getDate()) - Date.UTC(1900,0,31))/86400000;
        for(i=1900; i<2101 && offset>0; i++) {
            temp    = calendar.lYearDays(i);
            offset -= temp;
        }
        if(offset<0) {
            offset+=temp; i--;
        }
        
        //是否今天
        var isTodayObj = new Date(),
            isToday    = false;
        if(isTodayObj.getFullYear()==y && isTodayObj.getMonth()+1==m && isTodayObj.getDate()==d) {
            isToday = true;
        }
        //星期几
        var nWeek = objDate.getDay(),
           cWeek  = calendar.nStr1[nWeek];
        //数字表示周几顺应天朝周一开始的惯例
        if(nWeek==0) {
            nWeek = 7;
        }
        //农历年
        var year   = i;
        var leap   = calendar.leapMonth(i); //闰哪个月
        var isLeap = false;
        
        //效验闰月
        for(i=1; i<13 && offset>0; i++) {
            //闰月
            if(leap>0 && i==(leap+1) && isLeap==false){ 
                --i;
                isLeap = true; temp = calendar.leapDays(year); //计算农历闰月天数
            }
            else{
                temp = calendar.monthDays(year, i);//计算农历普通月天数
            }
            //解除闰月
            if(isLeap==true && i==(leap+1)) { isLeap = false; }
            offset -= temp;
        }
        // 闰月导致数组下标重叠取反
        if(offset==0 && leap>0 && i==leap+1)
        {
            if(isLeap){
                isLeap = false;
            }else{ 
                isLeap = true; --i;
            }
        }
        if(offset<0)
        {
            offset += temp; --i;
        }
        //农历月
        var month      = i;
        //农历日
        var day        = offset + 1;
        //天干地支处理
        var sm         = m-1;
        var gzY        = calendar.toGanZhiYear(year);
        
        // 当月的两个节气
        // bugfix-2017-7-24 11:03:38 use lunar Year Param `y` Not `year`
        var firstNode  = calendar.getTerm(y,(m*2-1));//返回当月「节」为几日开始
        var secondNode = calendar.getTerm(y,(m*2));//返回当月「节」为几日开始

        // 依据12节气修正干支月
        var gzM        = calendar.toGanZhi((y-1900)*12+m+11);
        if(d>=firstNode) {
            gzM        = calendar.toGanZhi((y-1900)*12+m+12);
        }
        
        //传入的日期的节气与否
        var isTerm = false;
        var Term   = null;
        if(firstNode==d) {
            isTerm  = true;
            Term    = calendar.solarTerm[m*2-2];
        }
        if(secondNode==d) {
            isTerm  = true;
            Term    = calendar.solarTerm[m*2-1];
        }
        //日柱 当月一日与 1900/1/1 相差天数
        var dayCyclical = Date.UTC(y,sm,1,0,0,0,0)/86400000+25567+10;
        var gzD         = calendar.toGanZhi(dayCyclical+d-1);
        //该日期所属的星座
        var astro       = calendar.toAstro(m,d);
        
        return {'lYear':year,'lMonth':month,'lDay':day,'Animal':calendar.getAnimal(year),'IMonthCn':(isLeap?"\u95f0":'')+calendar.toChinaMonth(month),'IDayCn':calendar.toChinaDay(day),'cYear':y,'cMonth':m,'cDay':d,'gzYear':gzY,'gzMonth':gzM,'gzDay':gzD,'isToday':isToday,'isLeap':isLeap,'nWeek':nWeek,'ncWeek':"\u661f\u671f"+cWeek,'isTerm':isTerm,'Term':Term,'astro':astro};
    },
    /**
      * 传入阳历年月日获得详细的公历、农历object信息 <=>JSON
      * @param y  solar year
      * @param m  solar month
      * @param d  solar day
      * @param h  solar hour
      * @return JSON object
      * @eg:console.log(calendar.solar2lunar(1987,11,01,01));
      */
    solar2lunar4:function (y,m,d,h) { //参数区间1900.1.31~2100.12.31
        //年份限定、上限
        if(y<1900 || y>2100) {
            return -1;// undefined转换为数字变为NaN
        }
        //公历传参最下限
        if(y==1900&&m==1&&d<31) {
            return -1;
        }
        //未传参  获得当天
        if(!y) {
            var objDate = new Date();
        }else {
            var objDate = new Date(y,parseInt(m)-1,d)
        }
        var i, leap=0, temp=0;
        //修正ymd参数
        var y = objDate.getFullYear(),
            m = objDate.getMonth()+1,
            d = objDate.getDate();
        var offset = (Date.UTC(objDate.getFullYear(),objDate.getMonth(),objDate.getDate()) - Date.UTC(1900,0,31))/86400000;
        for(i=1900; i<2101 && offset>0; i++) {
            temp    = calendar.lYearDays(i);
            offset -= temp;
        }
        if(offset<0) {
            offset+=temp; i--;
        }
        
        //是否今天
        var isTodayObj = new Date(),
            isToday    = false;
        if(isTodayObj.getFullYear()==y && isTodayObj.getMonth()+1==m && isTodayObj.getDate()==d) {
            isToday = true;
        }
        //星期几
        var nWeek = objDate.getDay(),
           cWeek  = calendar.nStr1[nWeek];
        //数字表示周几顺应天朝周一开始的惯例
        if(nWeek==0) {
            nWeek = 7;
        }
        //农历年
        var year   = i;
        var leap   = calendar.leapMonth(i); //闰哪个月
        var isLeap = false;
        
        //效验闰月
        for(i=1; i<13 && offset>0; i++) {
            //闰月
            if(leap>0 && i==(leap+1) && isLeap==false){ 
                --i;
                isLeap = true; temp = calendar.leapDays(year); //计算农历闰月天数
            }
            else{
                temp = calendar.monthDays(year, i);//计算农历普通月天数
            }
            //解除闰月
            if(isLeap==true && i==(leap+1)) { isLeap = false; }
            offset -= temp;
        }
        // 闰月导致数组下标重叠取反
        if(offset==0 && leap>0 && i==leap+1)
        {
            if(isLeap){
                isLeap = false;
            }else{ 
                isLeap = true; --i;
            }
        }
        if(offset<0)
        {
            offset += temp; --i;
        }
        //农历月
        var month      = i;
        //农历日
        var day        = offset + 1;
        //天干地支处理
        var sm         = m-1;
        var gzY        = calendar.toGanZhiYear(year);
        
        // 当月的两个节气
        // bugfix-2017-7-24 11:03:38 use lunar Year Param `y` Not `year`
        var firstNode  = calendar.getTerm(y,(m*2-1));//返回当月「节」为几日开始
        var secondNode = calendar.getTerm(y,(m*2));//返回当月「节」为几日开始

        // 依据12节气修正干支月
        var gzM        = calendar.toGanZhi((y-1900)*12+m+11);
        if(d>=firstNode) {
            gzM        = calendar.toGanZhi((y-1900)*12+m+12);
        }
        
        //传入的日期的节气与否
        var isTerm = false;
        var Term   = null;
        if(firstNode==d) {
            isTerm  = true;
            Term    = calendar.solarTerm[m*2-2];
        }
        if(secondNode==d) {
            isTerm  = true;
            Term    = calendar.solarTerm[m*2-1];
        }
        //日柱 当月一日与 1900/1/1 相差天数
        var dayCyclical = Date.UTC(y,sm,1,0,0,0,0)/86400000+25567+10;
        var gzD         = calendar.toGanZhi(dayCyclical+d-1);
        //该日期所属的星座
        var astro       = calendar.toAstro(m,d);
        
        //时柱
        var hour = Math.round(h/2);
        var gDm = 0;
        for(var i in Gan)
        if( gzD[0] == Gan[i] ) {
			gDm = i;
			break;
        }
        
        if(gDm > 4) {
        	gDm -= 5;
        }
        var gzH = Gan[gDm*2] + Zhi[hour];
        
        
        return {'lYear':year,'lMonth':month,'lDay':day,'lHour':hour,'Animal':calendar.getAnimal(year),'IMonthCn':(isLeap?"\u95f0":'')+calendar.toChinaMonth(month),'IDayCn':calendar.toChinaDay(day),'cYear':y,'cMonth':m,'cDay':d,'gzYear':gzY,'gzMonth':gzM,'gzDay':gzD,'gzHour':gzH,'isToday':isToday,'isLeap':isLeap,'nWeek':nWeek,'ncWeek':"\u661f\u671f"+cWeek,'isTerm':isTerm,'Term':Term,'astro':astro};
    },

    /**
      * 传入农历年月日以及传入的月份是否闰月获得详细的公历、农历object信息 <=>JSON
      * @param y  lunar year
      * @param m  lunar month
      * @param d  lunar day
      * @param isLeapMonth  lunar month is leap or not.[如果是农历闰月第四个参数赋值true即可]
      * @return JSON object
      * @eg:console.log(calendar.lunar2solar(1987,9,10));
      */
    lunar2solar:function(y,m,d,isLeapMonth) {   //参数区间1900.1.31~2100.12.1
        var isLeapMonth = !!isLeapMonth;
        var leapOffset  = 0;
        var leapMonth   = calendar.leapMonth(y);
        var leapDay     = calendar.leapDays(y);
        if(isLeapMonth&&(leapMonth!=m)) {return -1;}//传参要求计算该闰月公历 但该年得出的闰月与传参的月份并不同
        if(y==2100&&m==12&&d>1 || y==1900&&m==1&&d<31) {return -1;}//超出了最大极限值 
        var day  = calendar.monthDays(y,m); 
        var _day = day;
        //bugFix 2016-9-25 
        //if month is leap, _day use leapDays method 
        if(isLeapMonth) {
            _day = calendar.leapDays(y,m);
        }
        if(y < 1900 || y > 2100 || d > _day) {return -1;}//参数合法性效验
        
        //计算农历的时间差
        var offset = 0;
        for(var i=1900;i<y;i++) {
            offset+=calendar.lYearDays(i);
        }
        var leap = 0,isAdd= false;
        for(var i=1;i<m;i++) {
            leap = calendar.leapMonth(y);
            if(!isAdd) {//处理闰月
                if(leap<=i && leap>0) {
                    offset+=calendar.leapDays(y);isAdd = true;
                }
            }
            offset+=calendar.monthDays(y,i);
        }
        //转换闰月农历 需补充该年闰月的前一个月的时差
        if(isLeapMonth) {offset+=day;}
        //1900年农历正月一日的公历时间为1900年1月30日0时0分0秒(该时间也是本农历的最开始起始点)
        var stmap   =   Date.UTC(1900,1,30,0,0,0);
        var calObj  =   new Date((offset+d-31)*86400000+stmap);
        var cY      =   calObj.getUTCFullYear();
        var cM      =   calObj.getUTCMonth()+1;
        var cD      =   calObj.getUTCDate();

        return calendar.solar2lunar(cY,cM,cD);
    },


    /** youxing add 2017-10-20
      * 传入阳历年月日获得详细的公历、农历object信息 <=>JSON
      * @param y  solar year
      * @param m  solar month
      * @param d  solar day
      * @param h  solar hour
	  * @param z  早晚子时，传参则有早晚子时,不传按标准子时
      * @return JSON object
      * @eg:console.log(calendar.solar2lunar4(1987,11,01,01));
      */
    solar2lunar4:function (y,m,d,h,z) { //参数区间1900.1.31~2100.12.31
        //年份限定、上限
        if(y<1900 || y>2100) {
            return -1;// undefined转换为数字变为NaN
        }
        //公历传参最下限
        if(y==1900&&m==1&&d<31) {
            return -1;
        }
        
        //未传参  获得当天
        if(!y) {
            var objDate = new Date();
        }else {
        	
        	//这里特殊处理子时的农历日，如果hour是23点后则农历日为下一日 
        	// by youxing 2017-10-20

			// by youxing 2017-12-10 ，增加早晚子时
			if(!z) {
				if(h >= 23) {
					d = d + 1;
					h = 0;
				}
			} else {
				if(h >= 23) {
					h = 0;
				}
			}
	        
            var objDate = new Date(y,parseInt(m)-1,d,h); // by youxing 2017-10-20
            

        }
        var i, leap=0, temp=0;
        
        
              
        
        //修正ymd参数
        var y = objDate.getFullYear(),
            m = objDate.getMonth()+1,
            d = objDate.getDate();
            h = objDate.getHours(); // by youxing 2017-10-20
            
        var offset = (Date.UTC(objDate.getFullYear(),objDate.getMonth(),objDate.getDate()) - Date.UTC(1900,0,31))/86400000;
        for(i=1900; i<2101 && offset>0; i++) {
            temp    = calendar.lYearDays(i);
            offset -= temp;
        }
        if(offset<0) {
            offset+=temp; i--;
        }
        
        //是否今天
        var isTodayObj = new Date(),
            isToday    = false;
        if(isTodayObj.getFullYear()==y && isTodayObj.getMonth()+1==m && isTodayObj.getDate()==d) {
            isToday = true;
        }
        //星期几
        var nWeek = objDate.getDay(),
           cWeek  = calendar.nStr1[nWeek];
        //数字表示周几顺应天朝周一开始的惯例
        if(nWeek==0) {
            nWeek = 7;
        }
        //农历年
        var year   = i;
        var leap   = calendar.leapMonth(i); //闰哪个月
        var isLeap = false;
        
        //效验闰月
        for(i=1; i<13 && offset>0; i++) {
            //闰月
            if(leap>0 && i==(leap+1) && isLeap==false){ 
                --i;
                isLeap = true; 
				temp = calendar.leapDays(year); //计算农历闰月天数
            }
            else{
                temp = calendar.monthDays(year, i);//计算农历普通月天数
            }
            //解除闰月
            if(isLeap==true && i==(leap+1)) { isLeap = false; }
            offset -= temp;
        }
        // 闰月导致数组下标重叠取反
        if(offset==0 && leap>0 && i==leap+1)
        {
            if(isLeap){
                isLeap = false;
            }else{ 
                isLeap = true; --i;
            }
        }
        if(offset<0)
        {
            offset += temp; --i;
        }

		
        //农历月
        var month      = i;

		//农历月该月的天数
		 var MonthDays = temp;
        
        //农历日
        var day        = offset + 1;
        
        //天干地支处理
        var sm         = m-1;
        var gzY        = calendar.toGanZhiYear(year);
        
        // 当月的两个节气
        // bugfix-2017-7-24 11:03:38 use lunar Year Param `y` Not `year`
        var firstNode  = calendar.getTerm(y,(m*2-1));//返回当月「节」为几日开始
        var secondNode = calendar.getTerm(y,(m*2));//返回当月「节」为几日开始

        // 依据12节气修正干支月
        var gzM        = calendar.toGanZhi((y-1900)*12+m+11);
        if(d>=firstNode) {
            gzM        = calendar.toGanZhi((y-1900)*12+m+12);
        }
        
        //传入的日期的节气与否
        var isTerm = false;
        var Term   = null;
        if(firstNode==d) {
            isTerm  = true;
            Term    = calendar.solarTerm[m*2-2];
        }
        if(secondNode==d) {
            isTerm  = true;
            Term    = calendar.solarTerm[m*2-1];
        }
        //日柱 当月一日与 1900/1/1 相差天数
        var dayCyclical = Date.UTC(y,sm,1,0,0,0,0)/86400000+25567+10;
        var gzD         = calendar.toGanZhi(dayCyclical+d-1);
        //该日期所属的星座
        var astro       = calendar.toAstro(m,d);
        
        
        //--------------- by youxing 2017-10-20 -----------------
        //时柱
        var hour = Math.round(h/2);

        var gDm = 0;
        var i = 0
        for(var k in calendar.Gan){
           if( gzD[0] == calendar.Gan[i] ) {
			gDm = i;
			break;
          }
          i = i + 1
      }
        
        if(gDm > 4) {
        	gDm -= 5;
        }

        //修复错误--------------- by youxing 2018-12-21 -----------------
        //时辰天干计算错误
        //gDm为子时的，转换为现在时辰的干
        // console.log("gDm="+gDm+calendar.Gan[gDm] )
        gDm = gDm + hour
         console.log("gDm+hour="+gDm)

        if(gDm > 9){
            gDm  = gDm - 9
        }

        console.log("ggg="+calendar.Gan[gDm] )

        var gzH = calendar.Gan[gDm] + calendar.Zhi[hour];

        console.log("gzH="+gzH+","+gDm)
        
        
        return {'lYear':year,'lMonth':month,'lDay':day,'lHour':hour,'Animal':calendar.getAnimal(year),'IMonthCn':(isLeap?"\u95f0":'')+calendar.toChinaMonth(month),'lMonthDays':MonthDays,'IDayCn':calendar.toChinaDay(day),'cYear':y,'cMonth':m,'cDay':d,'gzYear':gzY,'gzMonth':gzM,'gzDay':gzD,'gzHour':gzH,'isToday':isToday,'isLeap':isLeap,'nWeek':nWeek,'ncWeek':"\u661f\u671f"+cWeek,'isTerm':isTerm,'Term':Term,'astro':astro};
    },
};


/**
* 紫微斗数排盘工具具体实现
*/


var tiangan = ['庚', '辛', '壬', '癸', '甲', '乙', '丙', '丁', '戊', '己'];
var dizhi = ['申', '酉', '戌', '亥', '子', '丑', '寅', '卯', '辰', '巳', '午', '未'];
var yearshu = ['猴', '鸡', '狗', '猪', '鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊'];
var templatenamelist = ['命宫','父母','福德','田宅','事业','交友','迁移','疾厄','财帛','子女','夫妻','兄弟'];
var longtimetemplatenamelist = ['运命','运父','运福','运宅','运事','运友','运迁','运疾','运财','运子','运夫','运兄'];
var yeartemplatenamelist = ['年命','年父','年福','年宅','年事','年友','年迁','年疾','年财','年子','年夫','年兄'];
var monthtemplatenamelist = ['月命','月父','月福','月宅','月事','月友','月迁','月疾','月财','月子','月妻','月兄'];
var daytemplatenamelist = ['日命','日父','日福','日宅','日事','日友','日迁','日疾','日财','日子','日妻','日兄'];


var wx_tglist = [
	['甲', '木'],
	['乙', '木'],
	['丙', '火'],
	['丁', '火'],
	['戊', '土'],
	['己', '土'],
	['庚', '金'],
	['辛', '金'],
	['壬', '水'],
	['癸', '水']
];

function TGtoWX(gan) {

	for(var k in wx_tglist) {
		if(wx_tglist[k][0] == gan) {
			return wx_tglist[k][1];
		}
	}

	return "ERROR";
}

//命宫表,按正月到十二月
var mglist = [
	['寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑'],
	['丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子'],
	['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'],
	['亥', '子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌'],
	['戌', '亥', '子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉'],
	['酉', '戌', '亥', '子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申'],
	['申', '酉', '戌', '亥', '子', '丑', '寅', '卯', '辰', '巳', '午', '未'],
	['未', '申', '酉', '戌', '亥', '子', '丑', '寅', '卯', '辰', '巳', '午'],
	['午', '未', '申', '酉', '戌', '亥', '子', '丑', '寅', '卯', '辰', '巳'],
	['巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑', '寅', '卯', '辰'],
	['辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑', '寅', '卯'],
	['卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑', '寅']
];

//身宫表,按正月到十二月
var sglist = [
	['寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑'],
	['卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑', '寅'],
	['辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑', '寅', '卯'],
	['巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑', '寅', '卯', '辰'],
	['午', '未', '申', '酉', '戌', '亥', '子', '丑', '寅', '卯', '辰', '巳'],
	['未', '申', '酉', '戌', '亥', '子', '丑', '寅', '卯', '辰', '巳', '午'],
	['申', '酉', '戌', '亥', '子', '丑', '寅', '卯', '辰', '巳', '午', '未'],
	['酉', '戌', '亥', '子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申'],
	['戌', '亥', '子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉'],
	['亥', '子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌'],
	['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'],
	['丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子']
];

//安十二宫,以命取其他宫
var twelvelist = [
	['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'],
	['亥', '子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌'],
	['戌', '亥', '子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉'],
	['酉', '戌', '亥', '子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申'],
	['申', '酉', '戌', '亥', '子', '丑', '寅', '卯', '辰', '巳', '午', '未'],
	['未', '申', '酉', '戌', '亥', '子', '丑', '寅', '卯', '辰', '巳', '午'],
	['午', '未', '申', '酉', '戌', '亥', '子', '丑', '寅', '卯', '辰', '巳'],
	['巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑', '寅', '卯', '辰'],
	['辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑', '寅', '卯'],
	['卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑', '寅'],
	['寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑'],
	['丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子'],
];

//安十二宫天干表,列为子-亥,行为甲-癸,
var twelvestemlist = [
	['丙', '丁', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸', '甲', '乙'],
	['戊', '己', '戊', '己', '庚', '辛', '壬', '癸', '甲', '乙', '丙', '丁'],
	['庚', '辛', '庚', '辛', '壬', '癸', '甲', '乙', '丙', '丁', '戊', '己'],
	['壬', '癸', '壬', '癸', '甲', '乙', '丙', '丁', '戊', '己', '庚', '辛'],
	['甲', '乙', '甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'],
	['丙', '丁', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸', '甲', '乙'],
	['戊', '己', '戊', '己', '庚', '辛', '壬', '癸', '甲', '乙', '丙', '丁'],
	['庚', '辛', '庚', '辛', '壬', '癸', '甲', '乙', '丙', '丁', '戊', '己'],
	['壬', '癸', '壬', '癸', '甲', '乙', '丙', '丁', '戊', '己', '庚', '辛'],
	['甲', '乙', '甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']
];

//安五行局表
var fivelementlist = [
	['水二局', '火六局', '木三局', '土五局', '金四局', '火六局'],
	['火六局', '土五局', '金四局', '木三局', '水二局', '土五局'],
	['土五局', '木三局', '水二局', '金四局', '火六局', '木三局'],
	['木三局', '金四局', '火六局', '水二局', '土五局', '金四局'],
	['金四局', '水二局', '土五局', '火六局', '木三局', '水二局'],
	['水二局', '火六局', '木三局', '土五局', '金四局', '火六局'],
	['火六局', '土五局', '金四局', '木三局', '水二局', '土五局'],
	['土五局', '木三局', '水二局', '金四局', '火六局', '木三局'],
	['木三局', '金四局', '火六局', '水二局', '土五局', '金四局'],
	['金四局', '水二局', '土五局', '火六局', '木三局', '水二局']
];

//大限表,命,父母...兄弟
var longtimelist = [
	['水二局', '阳男阴女', 2],
	['木三局', '阳男阴女', 3],
	['金四局', '阳男阴女', 4],
	['土五局', '阳男阴女', 5],
	['火六局', '阳男阴女', 6]
];

//安紫微表
var ziweilist = [
	['丑', '辰', '亥', '午', '酉'],
	['寅', '丑', '辰', '亥', '午'],
	['寅', '寅', '丑', '辰', '亥'],
	['卯', '巳', '寅', '丑', '辰'],
	['卯', '寅', '子', '寅', '丑'],
	['辰', '卯', '巳', '未', '寅'],
	['辰', '午', '寅', '子', '戌'],
	['巳', '卯', '卯', '巳', '未'],
	['巳', '辰', '丑', '寅', '丑'],
	['午', '未', '午', '卯', '巳'],
	['午', '辰', '卯', '寅', '寅'],
	['未', '巳', '辰', '丑', '卯'],
	['未', '申', '寅', '午', '亥'],
	['申', '巳', '未', '卯', '申'],
	['申', '午', '辰', '辰', '丑'],
	['酉', '酉', '巳', '酉', '午'],
	['酉', '午', '卯', '寅', '卯'],
	['戌', '未', '申', '未', '辰'],
	['戌', '戌', '巳', '辰', '子'],
	['亥', '未', '午', '巳', '酉'],
	['亥', '申', '辰', '戌', '寅'],
	['子', '亥', '酉', '卯', '未'],
	['子', '申', '午', '申', '辰'],
	['丑', '酉', '未', '巳', '巳'],
	['丑', '子', '巳', '午', '丑'],
	['寅', '酉', '戌', '亥', '戌'],
	['寅', '戌', '未', '辰', '卯'],
	['卯', '丑', '申', '酉', '申'],
	['卯', '戌', '午', '午', '巳'],
	['辰', '亥', '亥', '未', '午']
];

//安紫微后诸曜表,天机,太阳,武曲,天同,廉贞,以及天府
var ziweisetlist = [
	['亥', '子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌'],
	['酉', '戌', '亥', '子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申'],
	['申', '酉', '戌', '亥', '子', '丑', '寅', '卯', '辰', '巳', '午', '未'],
	['未', '申', '酉', '戌', '亥', '子', '丑', '寅', '卯', '辰', '巳', '午'],
	['辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑', '寅', '卯'],
	['辰', '卯', '寅', '丑', '子', '亥', '戌', '酉', '申', '未', '午', '巳']
];

//安天府后诸曜表 太阴,贪狼,巨门,天相,天梁,七杀,破军
var tianfusetlist = [
	['丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子'],
	['寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑'],
	['卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑', '寅'],
	['辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑', '寅', '卯'],
	['巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑', '寅', '卯', '辰'],
	['午', '未', '申', '酉', '戌', '亥', '子', '丑', '寅', '卯', '辰', '巳'],
	['戌', '亥', '子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉']
];

//安干系诸星表
var stemsetlist = [
	['寅', '卯', '巳', '午', '巳', '午', '申', '酉', '亥', '子'],
	['卯', '辰', '午', '未', '午', '未', '酉', '戌', '子', '丑'],
	['丑', '寅', '辰', '巳', '辰', '巳', '未', '申', '戌', '亥'],
	['丑', '子', '亥', '亥', '丑', '子', '丑', '午', '卯', '卯'],
	['未', '申', '酉', '酉', '未', '申', '未', '寅', '巳', '巳'],
	['未', '辰', '巳', '寅', '卯', '酉', '亥', '酉', '戌', '午'],
	['酉', '申', '子', '亥', '卯', '寅', '午', '巳', '午', '巳'],
	['巳', '午', '子', '巳', '午', '申', '寅', '午', '酉', '亥'],
	['申', '午', '辰', '寅', '子', '申', '午', '辰', '寅', '子'],
	['酉', '未', '巳', '卯', '丑', '酉', '未', '巳', '卯', '丑']
];

//安支系诸星表,天马,天空,天哭,天虚,龙池,凤阁,红鸾,天喜,孤辰,寡宿,月德,天德...蜚廉
var branchsetlist = [
	['寅', '亥', '申', '巳', '寅', '亥', '申', '巳', '寅', '亥', '申', '巳'],//天马
	['丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子'],//天空
	['午', '巳', '辰', '卯', '寅', '丑', '子', '亥', '戌', '酉', '申', '未'],//天哭
	['午', '未', '申', '酉', '戌', '亥', '子', '丑', '寅', '卯', '辰', '巳'],//天虚
	['辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑', '寅', '卯'],//龙池
	['戌', '酉', '申', '未', '午', '巳', '辰', '卯', '寅', '丑', '子', '亥'],//凤阁
	['卯', '寅', '丑', '子', '亥', '戌', '酉', '申', '未', '午', '巳', '辰'],//红鸾
	['酉', '申', '未', '午', '巳', '辰', '卯', '寅', '丑', '子', '亥', '戌'],//天喜
	['寅', '寅', '巳', '巳', '巳', '申', '申', '申', '亥', '亥', '亥', '寅'],//孤辰 
	['戌', '戌', '丑', '丑', '丑', '辰', '辰', '辰', '未', '未', '未', '戌'],//寡宿
	['巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑', '寅', '卯', '辰'],//月德
	['酉', '戌', '亥', '子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申'],//天德
	['戌', '酉', '申', '未', '午', '巳', '辰', '卯', '寅', '丑', '子', '亥'],//年解
	['巳', '寅', '亥', '申', '巳', '寅', '亥', '申', '巳', '寅', '亥', '申'],//劫煞
	['午', '未', '酉', '申', '亥', '戌', '丑', '子', '卯', '寅', '巳', '辰'],//大耗
	['酉', '午', '卯', '子', '酉', '午', '卯', '子', '酉', '午', '卯', '子'],//咸池
	['辰', '丑', '戌', '未', '辰', '丑', '戌', '未', '辰', '丑', '戌', '未'],//华盖
	['巳', '丑', '酉', '巳', '丑', '酉', '巳', '丑', '酉', '巳', '丑', '酉'],//破碎
	['申', '酉', '戌', '巳', '午', '未', '寅', '卯', '辰', '亥', '子', '丑'],//蜚廉
	['命', '父', '福', '田', '事', '友', '迁', '疾', '财', '子', '妻', '兄'] //天才
];

//安月系诸星表

//横坐标为十二个月,左辅,右弼,天刑,天姚,解神,天巫,天月,阴煞
var monthsetlist = [
	['辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑', '寅', '卯'],
	['戌', '酉', '申', '未', '午', '巳', '辰', '卯', '寅', '丑', '子', '亥'],
	['酉', '戌', '亥', '子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申'],
	['丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子'],
	['申', '申', '戌', '戌', '子', '子', '寅', '寅', '辰', '辰', '午', '午'],
	['巳', '申', '寅', '亥', '巳', '申', '寅', '亥', '巳', '申', '寅', '亥'],
	['戌', '巳', '辰', '寅', '未', '卯', '亥', '未', '寅', '午', '戌', '寅'],
	['寅', '子', '戌', '申', '午', '辰', '寅', '子', '戌', '申', '午', '辰']
];

//安日系诸星表

//安时系诸星表
var timelist = [
	['戌', '酉', '申', '未', '午', '巳', '辰', '卯', '寅', '丑', '子', '亥'],
	['辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑', '寅', '卯'],
	['丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子'],
	['卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑', '寅'],
	['寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑'],
	['戌', '亥', '子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉'],
	['卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑', '寅'],
	['戌', '亥', '子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉'],
	['酉', '戌', '亥', '子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申'],
	['戌', '亥', '子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉'],
	['亥', '子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌'],
	['亥', '戌', '酉', '申', '未', '午', '巳', '辰', '卯', '寅', '丑', '子'],
	['午', '未', '申', '酉', '戌', '亥', '子', '丑', '寅', '卯', '辰', '巳'],
	['寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑']
];

//安四化星表
var fourfloadlist = [
	['廉贞', '天机', '天同', '太阴', '贪狼', '武曲', '太阳', '巨门', '天梁', '破军'],
	['破军', '天梁', '天机', '天同', '太阴', '贪狼', '武曲', '太阳', '紫微', '巨门'],
	['武曲', '紫微', '文昌', '天机', '太阳', '天梁', '天府', '文曲', '天府', '太阴'],
	['太阳', '太阴', '廉贞', '巨门', '天机', '文曲', '天同', '文昌', '武曲', '贪狼']
];

//长生十二神表,只看长生的位置即可,横标为水二局---火六局
var changshenglist = ['申', '亥', '巳', '申', '寅'];

//安流年岁前诸星表
var suiqianlist = [
	['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'],
	['丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子'],
	['寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑'],
	['卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑', '寅'],
	['辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑', '寅', '卯'],
	['巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑', '寅', '卯', '辰'],
	['午', '未', '申', '酉', '戌', '亥', '子', '丑', '寅', '卯', '辰', '巳'],
	['未', '申', '酉', '戌', '亥', '子', '丑', '寅', '卯', '辰', '巳', '午'],
	['申', '酉', '戌', '亥', '子', '丑', '寅', '卯', '辰', '巳', '午', '未'],
	['酉', '戌', '亥', '子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申'],
	['戌', '亥', '子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉'],
	['亥', '子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌']
];

//安流年将前诸星表

var jiangqianlist = [
	['午', '子', '酉', '卯'],
	['未', '丑', '戌', '辰'],
	['申', '寅', '亥', '巳'],
	['酉', '卯', '子', '午'],
	['戌', '亥', '丑', '未'],
	['亥', '巳', '寅', '申'],
	['子', '午', '卯', '酉'],
	['丑', '未', '辰', '戌'],
	['寅', '申', '巳', '亥'],
	['卯', '酉', '午', '子'],
	['辰', '戌', '未', '丑'],
	['巳', '亥', '申', '寅']
];

//安旬空表
var xunkonglist = [
	['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'],
	['戌', '亥', '子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉'],
	['申', '酉', '戌', '亥', '子', '丑', '寅', '卯', '辰', '巳', '午', '未'],
	['午', '未', '申', '酉', '戌', '亥', '子', '丑', '寅', '卯', '辰', '巳'],
	['辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑', '寅', '卯'],
	['寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑']
];

//斗君

//小限 不分阴阳 男顺 女逆

//命主

//身主

//诸星庙陷总表
var brightnesslist = [
	['平', '庙', '庙', '旺', '陷', '旺', '庙', '庙', '旺', '平', '闲', '旺','紫微'],
	['庙', '陷', '旺', '旺', '庙', '平', '庙', '陷', '平', '旺', '庙', '平','天机'],
	['陷', '陷', '旺', '庙', '旺', '旺', '庙', '平', '闲', '闲', '陷', '陷','太阳'],
	['旺', '庙', '闲', '陷', '庙', '平', '旺', '庙', '平', '旺', '庙', '平','武曲'],
	['旺', '陷', '闲', '庙', '平', '庙', '陷', '陷', '旺', '平', '平', '庙','天同'],
	['平', '旺', '庙', '闲', '旺', '陷', '平', '庙', '庙', '平', '旺', '陷','廉贞'],
	['庙', '庙', '庙', '平', '庙', '平', '旺', '庙', '平', '陷', '庙', '旺','天府'],
	['庙', '庙', '闲', '陷', '闲', '陷', '陷', '平', '平', '旺', '旺', '庙','太阴'],
	['旺', '庙', '平', '地', '庙', '陷', '旺', '庙', '平', '平', '庙', '陷','贪狼'],
	['旺', '旺', '庙', '庙', '平', '平', '旺', '陷', '庙', '庙', '旺', '旺','巨门'],
	['庙', '庙', '庙', '陷', '旺', '平', '旺', '闲', '庙', '陷', '闲', '平','天相'],
	['庙', '旺', '庙', '庙', '旺', '陷', '庙', '旺', '陷', '地', '旺', '陷','天梁'],
	['旺', '庙', '庙', '陷', '旺', '平', '旺', '旺', '庙', '闲', '庙', '平','七杀'],
	['庙', '旺', '陷', '旺', '旺', '闲', '庙', '庙', '陷', '陷', '旺', '平','破军'],
	['无', '无', '旺', '无', '无', '平', '无', '无', '旺', '无', '无', '平','天马'],
	['旺', '无', '庙', '旺', '无', '庙', '旺', '无', '庙', '旺', '无', '庙','禄存'],
	['庙', '庙', '平', '旺', '庙', '庙', '陷', '旺', '平', '庙', '陷', '旺','文曲'],
	['旺', '庙', '陷', '平', '旺', '庙', '陷', '平', '旺', '庙', '陷', '旺','文昌'],
	['庙', '庙', '旺', '陷', '庙', '平', '旺', '庙', '闲', '陷', '庙', '平','右弼'],
	['旺', '庙', '庙', '陷', '庙', '平', '旺', '庙', '平', '陷', '庙', '闲','左辅'],
	['无', '无', '旺', '无', '无', '旺', '无', '旺', '庙', '庙', '无', '无','天钺'],
	['旺', '旺', '无', '庙', '无', '无', '庙', '无', '无', '无', '无', '旺','天魁'],
	['陷', '陷', '平', '平', '陷', '闲', '庙', '平', '庙', '平', '平', '旺','地劫'],
	['平', '陷', '陷', '平', '陷', '庙', '庙', '平', '庙', '庙', '陷', '陷','地空'],
	['平', '旺', '庙', '平', '闲', '旺', '庙', '闲', '陷', '陷', '庙', '平','火星'],
	['陷', '陷', '庙', '庙', '旺', '旺', '庙', '旺', '旺', '陷', '庙', '庙','铃星'],
	['无', '庙', '陷', '无', '庙', '陷', '无', '庙', '陷', '无', '庙', '陷','陀罗'],
	['陷', '庙', '无', '陷', '庙', '无', '平', '庙', '无', '陷', '庙', '无','擎羊']
];

//流昌曲
var LiuChangQulist = [
	['巳','午','申','酉','申','酉','亥','子','寅','卯'],
	['酉','申','午','巳','午','巳','卯','寅','子','亥']
];

//命主表
var mMasterlist = ['贪狼','巨门','禄存','文曲','廉贞','武曲','破军','武曲','廉贞','文曲','禄存','巨门'];

//身主表
var sMasterlist = ['火星','天相','天梁','天同','文昌','天机','火星','天相','天梁','天同','文昌','天机'];

//甲级星14颗
var gJiaStarlist = ['紫微','贪狼','巨门','廉贞','武曲','破军','天府','天相','天梁','天同','七杀','天机','太阳','太阴']

//乙级星14颗
var gYiStarlist = ['左辅','右弼','天魁','天钺','文昌','文曲','禄存','天马','火星','铃星','擎羊','陀罗','地空','地劫']


//将天干转换为数字甲-癸,为0-9
function StemToNumber(ss) {
	var steml = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
	var n = 0;
	
	for(n in steml) {
		if(steml[n] == ss) {
			return n;
		}
	}
	
	return -1;
};


function CNumToNum(s) {
	var cnum = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十",
			"十一", "十二", "十三", "十四", "十五", "十六", "十七", "十八", "十九", "二十",
			"廿一", "廿二", "廿三", "廿四", "廿五", "廿六", "廿七", "廿八", "廿九", "三十"];
	
	var n = 0;
	
	//去掉初一到初十的初
	if(s.indexOf('初') == 0) {
		s = s[1];
	}
	
	//去掉正月的正
	if(s.indexOf('正') == 0) {
		s = s[1];
	}
	
	for(n in cnum) {
		if(cnum[n] == s) {
			return n;
		}
	}

	return -1;

};

//将地支转换为数字子-亥,为0-11
function BranchToNumber(str) {
	var Branchs = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
	var n = 0;
	for(n in Branchs) {
		if(Branchs[n] == str) {
			return n;
		}
	}

	return -1;
};

//顺行宫位,或逆行宫位,b;起始宫位数字;t,走几个位置;s:1,顺行,0.逆行
function BranchGo(b, t, s) {
	//顺行
	if(s) {
		return(parseInt(b) + parseInt(t)) % 12;
	} else {
		return(parseInt(b) + parseInt(36) - parseInt(t)) % 12;
	}
};

//var gBranchs = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

//将数字转化为各个宫名
function NumberToBranch(n) {
	var Branchs = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
	for(var t in Branchs) {
		if(n == t) {
			return Branchs[t];
		}
	}
};

//获得天干的阴阳属性
function getStemYY(ss) {

	//阳干
	var yang = "甲丙戊庚壬";
	var yin = "乙丁己辛癸";

	if(yang.indexOf(ss) >= 0) {
		return 1;
	} else if(yin.indexOf(ss) >= 0) {
		return 0;
	} else {
		return -1;
	}
};
var CStembranch = {
	year: '0',
	month: '0',
	day: '0',
	hour: '0'
};

//StarList,所有星的综合数组,AStar:甲级星数组, BStar:乙级星,CStar:丙级星, DStar:丁级星, EStar:戊级星

//星的类
var star = {

	//星的名字
	name: "",

	//亮度
	brightness: "无",

	//星的级别,甲级,乙级等
	level: "",

	//该星落在哪个宫度
	branch: "",
	
	//四化,是否有四化,是什么化星
	sihua: "无",
	
	//大限四化
	ltff:"无",
	
	//流年四化
	yff:"无",
	
	//流月四化
	mff:"无",
	
	//流日四化
	dff:"无",
	
	//流时四化
	hff:"无",
	
	//自化信息,宫干射出的四化化到本宫的星
	zihua: "无",
	
	//化冲信息,其他宫干射出的四化化到本星所在宫位
	chong: "无"
};

//宫的类
var template = {

	init: function() {
		this.starlist = new Array();
		this.Jstarlist = new Array();
		this.Ystarlist = new Array();
		this.Astarlist = new Array();
		this.Bstarlist = new Array();
		this.Cstarlist = new Array();
		this.sixdemonlist = new Array();
		this.sixluckylist = new Array();
		this.ltstarlist = new Array();
		this.ltstarlist = new Array();
		this.ystarlist = new Array();
		this.mstarlist = new Array();
		this.dstarlist = new Array();
	},

	//星星列表
	starlist: {},

	//甲级星
	Jstarlist: {},

	//乙级星
	Ystarlist: {},
	
	//主星和辅星一起共28颗 
	Astarlist: {},

	//辅星
	Bstarlist: {},

	//小星
	Cstarlist: {},

	//六煞,
	sixdemonlist: {},

	//六吉
	sixluckylist: {},

	//长生十二神
	changsheng: {},

	//大限
	longtime: '',
	longtimestart:1,
	longtimeend:10,

	//小限
	shorttime: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],

	//天干
	stem: "未设",

	//地支
	branch: "未设",

	//宫名
	name: "未设",

	//身宫
	body: 0,
	
	//大限的流曜
	ltstarlist:{},
	ltname:"",
	
	//流年的流曜
	ystarlist:{},
	yname:"",
	ytime:'',
	yage:1,
	ystem:'',
	ybranch:'',
	
	//流月的流曜
	mstarlist:{},
	mname:"",
	mtime:'',
	mstem:'',
	mbranch:'',
	
	//流日的流曜
	dstarlist:{},
	dname:"",
	dtime:1,
	dstem:'',
	dbranch:'',
	

};


//命盘的类，主类
var destiny = {

	//原始信息 
	name: "name",
	sex: "sex",

	//阳历生日
	birthday: {},
	
	//农历生日
	lbirthday:{},

	//八字,StemBranch格式
	fourcolumn: {},

	stem: "",
	branch: "",
	sexyy: "未设", //阳男,阴男
	sexb: "未设", //乾造,坤造

	//命主紫微信息
	fivelement: "土五局",
	mMaster: "命主",
	sMaster: "身主",
	zidou: "子年斗君",

	//天盘十二宫
	skyastrolabe: {},

	//地盘十二宫
	earthastrolabe: {},

	//人盘十二宫
	peopleastrolabe: {},

	//天盘所有的星表
	skystarlist: {},
	
	
	//得到庙陷的描述符号
	getMiaoxianDes:function(m) {
		//庙旺地陷的符号表示●○△×
		var miaoxianlist =[ ['庙','旺','闲','平','地','陷'],
							['\u25CF','\u25CB','\u25B3','\u25B3','\u25B3','\u00D7']	];

		return m;
		for(k in miaoxianlist[0]) {
			if(m == miaoxianlist[0][k]) {
				return miaoxianlist[1][k];	
			}

		}

	},
	
	//生成新的星星,并安装到相应的宫度
	setStar: function(starname, starbranch, starlevel) {
		var newstar;
		newstar = Object.create(star);
		newstar.name = starname;
		
		if(BranchToNumber(starbranch) != -1) {
			newstar.branch = starbranch;
			this.skyastrolabe[BranchToNumber(starbranch)].starlist.push(newstar);
			this.skystarlist.push(newstar);

			if(starlevel == 1) {
				this.skyastrolabe[BranchToNumber(starbranch)].Astarlist.push(newstar);
				// 如果星曜名字在14颗主星列表内，则增加到Jstarlist中去
				if(gJiaStarlist.indexOf(starname) != -1) {
					this.skyastrolabe[BranchToNumber(starbranch)].Jstarlist.push(newstar);
				}

				if(gYiStarlist.indexOf(starname) != -1) {
					this.skyastrolabe[BranchToNumber(starbranch)].Ystarlist.push(newstar);
				}
			} else if(starlevel == 2) {
				this.skyastrolabe[BranchToNumber(starbranch)].Bstarlist.push(newstar);
			} else if(starlevel == 3) {
				this.skyastrolabe[BranchToNumber(starbranch)].Cstarlist.push(newstar);
			} else if(starlevel == 6) {
				this.skyastrolabe[BranchToNumber(starbranch)].sixdemonlist.push(newstar);
			} else if(starlevel == 8) {
				this.skyastrolabe[BranchToNumber(starbranch)].changsheng = newstar;
			} else {
				return 0;
			}
		} else {
			console.log("Error!!! starbranch = " + starbranch);
		}

		return 1;
	},
	
	
	//设置大限流曜到相应的宫度
	setLTStar: function(starname, starbranch) {
		var newstar;
		newstar = Object.create(star);
		newstar.name = starname;
		
//		console.log("setStar:newstar:" + JSON.stringify(newstar));
//		console.log("setStar:starbranch:"+starbranch);
		
		if(BranchToNumber(starbranch) != -1) {
			newstar.branch = starbranch;
		
//			console.log("setStar:BtN:starbranch:"+BranchToNumber(starbranch));
//			console.log("setStar:skyastrolabe:" + JSON.stringify(this.skyastrolabe[BranchToNumber(starbranch)]));
			
			this.skyastrolabe[BranchToNumber(starbranch)].ltstarlist.push(newstar);
		} else {
			console.log("设置大限流曜星耀地支错误!!!starbranch = " + starbranch);
			return 0;
		}

		return 1;
	},
	
	//设置大限化流曜到星耀
	setLTFFStar:function(ffname,starname) {
		
		for(var t in this.skystarlist) {
			
			if(this.skystarlist[t].name == starname) {
				this.skystarlist[t].ltff = ffname;
				return 1;
			}
			
		}
		
		//没有找到
		return 0;
	},
	
	//设置流年流曜到相应的宫度
	setYStar: function(starname, starbranch) {
		var newstar;
		newstar = Object.create(star);
		newstar.name = starname;
		
//		console.log("setStar:newstar:" + JSON.stringify(newstar));
//		console.log("setStar:starbranch:"+starbranch);
		
		if(BranchToNumber(starbranch) != -1) {
			newstar.branch = starbranch;
		
//			console.log("setStar:BtN:starbranch:"+BranchToNumber(starbranch));
//			console.log("setStar:skyastrolabe:" + JSON.stringify(this.skyastrolabe[BranchToNumber(starbranch)]));
			
			this.skyastrolabe[BranchToNumber(starbranch)].ystarlist.push(newstar);
		} else {
			console.log("设置流年流曜星耀地支错误!!!starbranch = " + starbranch);
			return 0;
		}

		return 1;
	},
	
	//设置流年化流曜到星耀
	setYFFStar:function(ffname,starname) {
		
		for(var t in this.skystarlist) {
			
			if(this.skystarlist[t].name == starname) {
				this.skystarlist[t].yff = ffname;
				return 1;
			}
			
		}
		
		//没有找到
		return 0;
	},

	//计算自化星耀
	//检查每个宫位的天干所射出的四化是否化到本宫内的星曜
	calculateZihua: function() {
		console.log("开始计算自化星耀...");
		
		// 遍历每个宫位
		for(var palaceIndex = 0; palaceIndex < 12; palaceIndex++) {
			var palace = this.skyastrolabe[palaceIndex];
			var palaceStem = palace.stem; // 该宫的天干
			var stemnum = StemToNumber(palaceStem);
			
			if(stemnum === -1) {
				console.log("天干转换错误: " + palaceStem);
				continue;
			}
			
			// 获取该天干的四化星名
			var luStar = fourfloadlist[0][stemnum]; // 化禄星
			var quanStar = fourfloadlist[1][stemnum]; // 化权星
			var keStar = fourfloadlist[2][stemnum]; // 化科星
			var jiStar = fourfloadlist[3][stemnum]; // 化忌星
			
			console.log(palace.name + "宫(" + palace.branch + ")天干" + palaceStem + 
					   "的四化: 禄-" + luStar + ", 权-" + quanStar + 
					   ", 科-" + keStar + ", 忌-" + jiStar);
			
			// 检查本宫内的所有星曜
			for(var starIndex = 0; starIndex < palace.starlist.length; starIndex++) {
				var star = palace.starlist[starIndex];
				
				// 检查是否自化
				if(star.name === luStar) {
					star.zihua = "自化禄";
					console.log("  发现自化: " + star.name + " 自化禄");
				} else if(star.name === quanStar) {
					star.zihua = "自化权";
					console.log("  发现自化: " + star.name + " 自化权");
				} else if(star.name === keStar) {
					star.zihua = "自化科";
					console.log("  发现自化: " + star.name + " 自化科");
				} else if(star.name === jiStar) {
					star.zihua = "自化忌";
					console.log("  发现自化: " + star.name + " 自化忌");
				}
			}
		}
		
		console.log("自化星耀计算完毕");
	},
	
	//计算化冲星耀
	//检查每个宫位的天干所射出的四化是否化到对宫内的星耀
	calculateChong: function() {
		console.log("开始计算化冲星耀...");
		
		// 遍历每个宫位
		for(var palaceIndex = 0; palaceIndex < 12; palaceIndex++) {
			var palace = this.skyastrolabe[palaceIndex];
			var palaceStem = palace.stem; // 该宫的天干
			var stemnum = StemToNumber(palaceStem);
			
			if(stemnum === -1) {
				console.log("天干转换错误: " + palaceStem);
				continue;
			}
			
			// 获取该天干的四化星名
			var luStar = fourfloadlist[0][stemnum]; // 化禄星
			var quanStar = fourfloadlist[1][stemnum]; // 化权星
			var keStar = fourfloadlist[2][stemnum]; // 化科星
			var jiStar = fourfloadlist[3][stemnum]; // 化忌星
			
			// 计算对宫位置（相差6个位置）
			var oppositePalaceIndex = (palaceIndex + 6) % 12;
			var oppositePalace = this.skyastrolabe[oppositePalaceIndex];
			
			console.log(palace.name + "宫(" + palace.branch + ")对" + 
					   oppositePalace.name + "宫(" + oppositePalace.branch + ")的化冲检查");
			
			// 检查对宫内的所有星耀
			for(var starIndex = 0; starIndex < oppositePalace.starlist.length; starIndex++) {
				var star = oppositePalace.starlist[starIndex];
				
				// 检查是否化冲
				if(star.name === luStar) {
					star.chong = "禄冲";
					console.log("  发现化冲: " + palace.name + "宫天干" + palaceStem + 
							   "化禄冲" + oppositePalace.name + "宫的" + star.name);
				} else if(star.name === quanStar) {
					star.chong = "权冲";
					console.log("  发现化冲: " + palace.name + "宫天干" + palaceStem + 
							   "化权冲" + oppositePalace.name + "宫的" + star.name);
				} else if(star.name === keStar) {
					star.chong = "科冲";
					console.log("  发现化冲: " + palace.name + "宫天干" + palaceStem + 
							   "化科冲" + oppositePalace.name + "宫的" + star.name);
				} else if(star.name === jiStar) {
					star.chong = "忌冲";
					console.log("  发现化冲: " + palace.name + "宫天干" + palaceStem + 
							   "化忌冲" + oppositePalace.name + "宫的" + star.name);
				}
			}
		}
		
		console.log("化冲星耀计算完毕");
	},
	
	//获取五行局对应的
	getFivenum: function() {
		if(this.fivelement == "水二局") {
			return 0;
		} else if(this.fivelement == "木三局") {
			return 1;
		} else if(this.fivelement == "金四局") {
			return 2;
		} else if(this.fivelement == "土五局") {
			return 3;
		} else if(this.fivelement == "火六局") {
			return 4;
		} else {
			return -1;
		}
	},
	
	

	//调用起始方法
	//根据原始信息创建天盘,注意生日应该为
	createSky: function(name, sex, birthday) {
		
		console.log("");
		console.log("------------开始计算命盘------------");
		console.log("");
		
		this.name = name;
		this.sex = sex;

		if(sex == "男") {
			this.sexb = "乾造";
		} else {
			this.sexb = "坤造";
		}

		//将birthday转化为时间对象Date
		var y = birthday.split('-');
		var d = y[2].split(' ');
		var t = d[1].split(':')

		this.birthday.year = parseInt(y[0]);
		this.birthday.month = parseInt(y[1]);
		this.birthday.day = parseInt(d[0]);
		this.birthday.hour = parseInt(t[0]);
		this.birthday.minute = parseInt(t[1]);
		
		// 验证输入参数
		if (this.birthday.year < 1900 || this.birthday.year > 2100) {
			throw new Error("年份必须在1900-2100之间");
		}
		
		console.log(this.birthday.year+":"+ this.birthday.month+":"+ this.birthday.day+":"+ this.birthday.hour)
		//从阳历转换为农历,以及干支
		var lb = calendar.solar2lunar4(this.birthday.year, this.birthday.month, this.birthday.day, this.birthday.hour,1);
		
		// 检查农历转换结果
		if (lb === -1) {
			throw new Error("日期转换失败，请检查输入的日期是否正确");
		}

		this.fourcolumn.year = lb.gzYear;
		this.fourcolumn.month = lb.gzMonth;
		this.fourcolumn.day = lb.gzDay;
		this.fourcolumn.hour = lb.gzHour;
		
		this.lbirthday.year = lb.lYear;
		this.lbirthday.month = lb.lMonth;
		this.lbirthday.day = lb.lDay;
		this.lbirthday.hour = lb.lHour;

		this.lbirthday.cMonth = lb.IMonthCn;
		this.lbirthday.cDay = lb.IDayCn;
		this.lbirthday.cYear = lb.gzYear;

		
		
		
		console.log(this.sexb + ": " + this.fourcolumn.year +' ' + this.fourcolumn.month + ' ' + this.fourcolumn.day + ' ' + this.fourcolumn.hour);
		console.log("阳历: " + this.birthday.year +'年' + this.birthday.month + '月' + this.birthday.day + '日' + this.birthday.hour + '时');
		console.log("农历: " + this.lbirthday.year +'年' + this.lbirthday.month + '月' + this.lbirthday.day + '日' + this.lbirthday.hour + '时');

		
		
		//创建星星总队列
		this.skystarlist = new Array();


		let stem,branch, stemnum, branchnum, monthnum, daynum, timenum;

		stem = this.fourcolumn.year[0];
		branch = this.fourcolumn.year[1];
		
		//这个是生年的年干和年支
		this.stem = stem;
		this.branch = branch;

		
		//全部转化为数组的序号
		stemnum = StemToNumber(stem);
		branchnum = BranchToNumber(branch);
		monthnum = this.lbirthday.month - 1;
		daynum = this.lbirthday.day-1;
		timenum = this.lbirthday.hour;

		//判断闰月
		if(lb.isLeap) {
			console.log("这是一个闰月啊");
			if(lb.lDay >= parseInt(lb.lMonthDays/2)) {
				monthnum = this.lbirthday.month;
				console.log("这是一个闰月且大了了了："+monthnum);
			}
		}

		console.log("stemnum:" + stemnum +"  branchnum:" + branchnum + "  monthnum:" + monthnum + "  daynum:" + daynum + "  timenum:" + timenum);
		
			
		//设置阴阳男女
		if(this.sex == "男") {
			if(getStemYY(this.stem) === 1) {
				this.sexyy = "阳男";
			} else {
				this.sexyy = "阴男";
			}
		} else {
			if(getStemYY(this.stem) === 1) {
				this.sexyy = "阳女";
			} else {
				this.sexyy = "阴女";
			}
		}

		//得到命宫的地支
		var mgbranch = mglist[timenum][monthnum];

		//得到身宫的地支
		var sgbranch = sglist[timenum][monthnum];

		//命宫地支编号,在十二宫的位置
		var mgbnum = BranchToNumber(mgbranch);

		console.log("命宫地支:" + mgbranch + "   身宫地支:" + sgbranch);

		//安十二宫地支,位置固定不变的
		this.skyastrolabe = new Array(12);

		for( var t = 0 ; t<12 ; t++) {
			this.skyastrolabe[t] = Object.create(template);
			this.skyastrolabe[t].branch = NumberToBranch(t);
		}
		
		console.log("1.十二宫地支设置完毕!");

		
		//安命宫,身宫
		for(t in this.skyastrolabe) {
			if(this.skyastrolabe[t].branch == mgbranch) {
				this.skyastrolabe[t].name = "命宫";
			}

			if(this.skyastrolabe[t].branch == sgbranch) {
				this.skyastrolabe[t].body = 1;
			}
		}

		////////////////////////////////////////
		//安十二宫
		
		
		var brotherbranch = twelvelist[1][mgbnum];
		var wifebranch = twelvelist[2][mgbnum];
		var childbranch = twelvelist[3][mgbnum];
		var moneybranch = twelvelist[4][mgbnum];
		var illbranch = twelvelist[5][mgbnum];
		var farbranch = twelvelist[6][mgbnum];
		var friendbranch = twelvelist[7][mgbnum];
		var careerbranch = twelvelist[8][mgbnum];
		var landbranch = twelvelist[9][mgbnum];
		var heartbranch = twelvelist[10][mgbnum];
		var parentbranch = twelvelist[11][mgbnum];


		for(t in this.skyastrolabe) {
			if(this.skyastrolabe[t].branch == brotherbranch) {
				this.skyastrolabe[t].name = templatenamelist[11];
			} else if(this.skyastrolabe[t].branch == wifebranch) {
				this.skyastrolabe[t].name = templatenamelist[10];
			} else if(this.skyastrolabe[t].branch == childbranch) {
				this.skyastrolabe[t].name = templatenamelist[9];
			} else if(this.skyastrolabe[t].branch == moneybranch) {
				this.skyastrolabe[t].name = templatenamelist[8];
			} else if(this.skyastrolabe[t].branch == illbranch) {
				this.skyastrolabe[t].name = templatenamelist[7];
			} else if(this.skyastrolabe[t].branch == farbranch) {
				this.skyastrolabe[t].name = templatenamelist[6];
			} else if(this.skyastrolabe[t].branch == friendbranch) {
				this.skyastrolabe[t].name = templatenamelist[5];
			} else if(this.skyastrolabe[t].branch == careerbranch) {
				this.skyastrolabe[t].name = templatenamelist[4];
			} else if(this.skyastrolabe[t].branch == landbranch) {
				this.skyastrolabe[t].name = templatenamelist[3];
			} else if(this.skyastrolabe[t].branch == heartbranch) {
				this.skyastrolabe[t].name = templatenamelist[2];
			} else if(this.skyastrolabe[t].branch == parentbranch) {
				this.skyastrolabe[t].name = templatenamelist[1];
			}

			if(this.skyastrolabe[t].branch == sgbranch) {
				var tempname = this.skyastrolabe[t].name;
				this.skyastrolabe[t].name = tempname[0] + "|身";
			}

		}

		console.log("2.十二宫宫名设置完毕!");
		
		////////////////////////////////////////
		//安十二宫天干
		for(t in this.skyastrolabe) {
			this.skyastrolabe[t].stem = twelvestemlist[stemnum][t];
		}
		
		console.log("3.十二宫天干设置完毕!");

		////////////////////////////////////////
		//安五行局
		this.fivelement = fivelementlist[stemnum][parseInt(mgbnum / 2)];
		
		console.log("4.五行局设置完毕! " + this.fivelement);

		//////////////////////////////////////
		//安大限
		var j;
		var t;
		j = 0;
		t = 0;

		for(j in longtimelist) {
			if(longtimelist[j][0] == this.fivelement) {
				var n;
				n = 0;
				if(longtimelist[j][1].indexOf(this.sexyy) >= 0) {
					//阳男阴女,顺行
					for(t in this.skyastrolabe) {
						
						if(parseInt(t) < parseInt(mgbnum)) {
							n = parseInt(t)  + 12;
							n = n - parseInt(mgbnum);
						} else {
							n = t - mgbnum;
						}
						var startyear;
						startyear = parseInt(longtimelist[j][2]) + 10 * n;
						//console.log("n:t = " + n + ":" + t + "    start year:" + (parseInt(longtimelist[j][2])+10*n));
						this.skyastrolabe[t].longtime = String(startyear) + "-" + String(startyear + 9);
						this.skyastrolabe[t].longtimestart = startyear;
						this.skyastrolabe[t].longtimeend = startyear+9;
					}
				} else {
					for(t in this.skyastrolabe) {

						if(parseInt(mgbnum) >= parseInt(t)) {
							n = mgbnum - t;
						} else {

							n = 12 - (t - mgbnum);
						}

						var startyear;
						startyear = longtimelist[j][2] + 10 * n;
						//						console.log("startyear="+startyear+"   n=" + n);
						this.skyastrolabe[t].longtime = String(startyear) + "-" + String(startyear + 9);
						this.skyastrolabe[t].longtimestart = startyear;
						this.skyastrolabe[t].longtimeend = startyear+9;
					}
				}

			}
		}
		
		console.log("5.大限设置完毕!");
		
		
		//安星前创建所有星表

		console.log("-------------->");
		console.log("6.开始设置诸星");
		for(var t in this.skyastrolabe) {
			this.skyastrolabe[t].init();
		}

		////////////////////////////////////////
		//安紫微
		
		console.log("daynum="+daynum + "getFivenum()="+this.getFivenum());
		var ziwei;
		ziwei = ziweilist[daynum][this.getFivenum()];
		
		console.log("紫微宫位:" + ziwei);
		
		this.setStar('紫微', ziwei, 1);
		
		console.log("6.1安置紫微完毕");

		//安紫微后诸曜
		var ziweinum = BranchToNumber(ziwei);

		this.setStar('天机', ziweisetlist[0][ziweinum], 1);
		this.setStar('太阳', ziweisetlist[1][ziweinum], 1);
		this.setStar('武曲', ziweisetlist[2][ziweinum], 1);
		this.setStar('天同', ziweisetlist[3][ziweinum], 1);
		this.setStar('廉贞', ziweisetlist[4][ziweinum], 1);
		this.setStar('天府', ziweisetlist[5][ziweinum], 1);
		
		console.log("6.2安置紫微后诸曜完毕");

		//安天府后诸曜
		var tianfunum = BranchToNumber(ziweisetlist[5][ziweinum]);
		this.setStar('太阴', tianfusetlist[0][tianfunum], 1);
		this.setStar('贪狼', tianfusetlist[1][tianfunum], 1);
		this.setStar('巨门', tianfusetlist[2][tianfunum], 1);
		this.setStar('天相', tianfusetlist[3][tianfunum], 1);
		this.setStar('天梁', tianfusetlist[4][tianfunum], 1);
		this.setStar('七杀', tianfusetlist[5][tianfunum], 1);
		this.setStar('破军', tianfusetlist[6][tianfunum], 1);

		console.log("6.3安置天府后诸曜完毕");
		//安干系

		this.setStar('禄存', stemsetlist[0][stemnum], 1);
		this.setStar('擎羊', stemsetlist[1][stemnum], 6);
		this.setStar('陀罗', stemsetlist[2][stemnum], 6);
		this.setStar('天魁', stemsetlist[3][stemnum], 1);
		this.setStar('天钺', stemsetlist[4][stemnum], 1);
		this.setStar('天官', stemsetlist[5][stemnum], 2);
		this.setStar('天福', stemsetlist[6][stemnum], 2);
		this.setStar('天厨', stemsetlist[7][stemnum], 2);

//		if(this.sexyy == "阳男" || this.sexyy == "阴女") {
//			this.setStar('截空', stemsetlist[8][stemnum], 2);
//		} else {
//			this.setStar('截空', stemsetlist[9][stemnum], 2);
//		}

		//截空有两个,都放上去
		this.setStar('截空', stemsetlist[8][stemnum], 2);
		this.setStar('截空', stemsetlist[9][stemnum], 2);
		
		console.log("6.4安置干系诸曜完毕");
		//安支系

		this.setStar('天马', branchsetlist[0][branchnum], 1);
		this.setStar('天空', branchsetlist[1][branchnum], 2);
		this.setStar('天哭', branchsetlist[2][branchnum], 2);
		this.setStar('天虚', branchsetlist[3][branchnum], 2);
		this.setStar('龙池', branchsetlist[4][branchnum], 2);
		this.setStar('凤阁', branchsetlist[5][branchnum], 2);
		this.setStar('红鸾', branchsetlist[6][branchnum], 2);
		this.setStar('天喜', branchsetlist[7][branchnum], 2);
		this.setStar('孤辰', branchsetlist[8][branchnum], 2);
		this.setStar('寡宿', branchsetlist[9][branchnum], 2);
		this.setStar('月德', branchsetlist[10][branchnum], 2);
		this.setStar('天德', branchsetlist[11][branchnum], 2);
		this.setStar('年解', branchsetlist[12][branchnum], 2);
		this.setStar('劫煞', branchsetlist[13][branchnum], 2);
		this.setStar('大耗', branchsetlist[14][branchnum], 2);
		this.setStar('咸池', branchsetlist[15][branchnum], 2);
		this.setStar('华盖', branchsetlist[16][branchnum], 2);
		this.setStar('破碎', branchsetlist[17][branchnum], 2);
		this.setStar('蜚廉', branchsetlist[18][branchnum], 2);

		//安旬空
		for( var b in xunkonglist) {
			if( xunkonglist[b][stemnum] == NumberToBranch(branchnum)) {
				this.setStar('旬空', xunkonglist[b][10], 2);
				this.setStar('旬空', xunkonglist[b][11], 2);
				//console.log("旬空的宫位是： "+xunkonglist[b][10]);
			}
		}
		
		console.log("6.5安置支系诸曜完毕");
		
		//安天才
		var tiancai = branchsetlist[19][branchnum];

		for(var t in this.skyastrolabe) {
			if(this.skyastrolabe[t].name.indexOf(tiancai) >= 0) {
				this.setStar('天才', this.skyastrolabe[t].branch, 2);
				//console.log("branchnum = " + branchnum + tiancai + this.skyastrolabe[t].branch);
			}

		}

		//安天寿
		for(var t in this.skyastrolabe) {
			if(this.skyastrolabe[t].body) {

				//console.log("t+branchnum:" + (parseInt(t)+parseInt(branchnum)));
				if(parseInt(t) + parseInt(branchnum) <= 11) {
					this.setStar('天寿', this.skyastrolabe[parseInt(t) + parseInt(branchnum)].branch, 2);
				} else {
					this.setStar('天寿', this.skyastrolabe[parseInt(t) + parseInt(branchnum) - 12].branch, 2);
				}
			}
		}

		//安月系
		this.setStar('左辅', monthsetlist[0][monthnum], 1);
		this.setStar('右弼', monthsetlist[1][monthnum], 1);
		this.setStar('天刑', monthsetlist[2][monthnum], 2);
		this.setStar('天姚', monthsetlist[3][monthnum], 2);
		this.setStar('解神', monthsetlist[4][monthnum], 2);
		this.setStar('天巫', monthsetlist[5][monthnum], 2);
		this.setStar('天月', monthsetlist[6][monthnum], 2);
		this.setStar('阴煞', monthsetlist[7][monthnum], 2);

		console.log("6.6安置月系诸曜完毕");
		
		//安时系
		//看是哪个三合,寅午戌 1,申子辰 2,巳酉丑 3,亥卯未 4
		var s1 = "寅午戌",
			s2 = "申子辰",
			s3 = "巳酉丑",
			s4 = "亥卯未";
		var shj = 0;
		if(s1.indexOf(branch) >= 0) {
			shj = 1;
		} else if(s2.indexOf(branch) >= 0) {
			shj = 2;
		} else if(s3.indexOf(branch) >= 0) {
			shj = 3;
		} else if(s4.indexOf(branch) >= 0) {
			shj = 4;
		} else {
			console.log("error!!!!!!!!三合");
		}

		this.setStar('火星', timelist[shj * 2][timenum], 6);
		this.setStar('铃星', timelist[parseInt(shj * 2) + parseInt(1)][timenum], 6);
		this.setStar('地劫', timelist[10][timenum], 6);
		this.setStar('地空', timelist[11][timenum], 6);
		this.setStar('台辅', timelist[12][timenum], 2);
		this.setStar('封诰', timelist[13][timenum], 2);

		//安昌曲
		this.setStar('文昌', timelist[0][timenum], 1);
		this.setStar('文曲', timelist[1][timenum], 1);
		
		console.log("6.6安置时系诸曜完毕");

		//安日系
		this.setStar('三台', NumberToBranch(BranchGo(BranchToNumber(monthsetlist[0][monthnum]), daynum, 1)), 2);
		this.setStar('八座', NumberToBranch(BranchGo(BranchToNumber(monthsetlist[1][monthnum]), daynum, 0)), 2);
		this.setStar('恩光', NumberToBranch(BranchGo(BranchToNumber(timelist[0][timenum]), daynum - 1, 1)), 2);
		this.setStar('天贵', NumberToBranch(BranchGo(BranchToNumber(timelist[1][timenum]), daynum - 1, 1)), 2);

		console.log("6.7安置日系诸曜完毕");
		
		//安流年岁前诸星

		this.setStar('岁建', suiqianlist[0][branchnum], 3);
		this.setStar('晦气', suiqianlist[1][branchnum], 3);
		this.setStar('丧门', suiqianlist[2][branchnum], 3);
		this.setStar('贯索', suiqianlist[3][branchnum], 3);
		this.setStar('官符', suiqianlist[4][branchnum], 3);
		this.setStar('小耗', suiqianlist[5][branchnum], 3);
		this.setStar('岁破', suiqianlist[6][branchnum], 3);
		this.setStar('龙德', suiqianlist[7][branchnum], 3);
		this.setStar('白虎', suiqianlist[8][branchnum], 3);
		this.setStar('天德', suiqianlist[9][branchnum], 3);
		this.setStar('吊客', suiqianlist[10][branchnum], 3);
		this.setStar('病符', suiqianlist[11][branchnum], 3);
		
		console.log("6.8安置流年岁前诸曜完毕");

		//安流年将前诸星

		this.setStar('将星', jiangqianlist[0][shj - 1], 3);
		this.setStar('攀鞍', jiangqianlist[1][shj - 1], 3);
		this.setStar('岁驿', jiangqianlist[2][shj - 1], 3);
		this.setStar('息神', jiangqianlist[3][shj - 1], 3);
		this.setStar('华盖', jiangqianlist[4][shj - 1], 3);
		this.setStar('劫煞', jiangqianlist[5][shj - 1], 3);
		this.setStar('灾煞', jiangqianlist[6][shj - 1], 3);
		this.setStar('天煞', jiangqianlist[7][shj - 1], 3);
		this.setStar('指背', jiangqianlist[8][shj - 1], 3);
		this.setStar('咸池', jiangqianlist[9][shj - 1], 3);
		this.setStar('月煞', jiangqianlist[10][shj - 1], 3);
		this.setStar('亡神', jiangqianlist[11][shj - 1], 3);
		
		console.log("6.9安置流年将前诸曜完毕");

		//安博士十二星
		//取禄存
		var lucun = stemsetlist[0][stemnum];
		var lucunnum = BranchToNumber(lucun);

		//如果阳男顺,阴男逆
		if((this.sexyy == "阳男") || (this.sexyy == "阴女")) {
			this.setStar('博士', NumberToBranch(BranchGo(lucunnum, 0, 1)), 3);
			this.setStar('力士', NumberToBranch(BranchGo(lucunnum, 1, 1)), 3);
			this.setStar('青龙', NumberToBranch(BranchGo(lucunnum, 2, 1)), 3);
			this.setStar('小耗', NumberToBranch(BranchGo(lucunnum, 3, 1)), 3);
			this.setStar('将军', NumberToBranch(BranchGo(lucunnum, 4, 1)), 3);
			this.setStar('奏书', NumberToBranch(BranchGo(lucunnum, 5, 1)), 3);
			this.setStar('飞廉', NumberToBranch(BranchGo(lucunnum, 6, 1)), 3);
			this.setStar('喜神', NumberToBranch(BranchGo(lucunnum, 7, 1)), 3);
			this.setStar('病符', NumberToBranch(BranchGo(lucunnum, 8, 1)), 3);
			this.setStar('大耗', NumberToBranch(BranchGo(lucunnum, 9, 1)), 3);
			this.setStar('伏兵', NumberToBranch(BranchGo(lucunnum, 10, 1)), 3);
			this.setStar('官符', NumberToBranch(BranchGo(lucunnum, 11, 1)), 3);
		} else {
			this.setStar('博士', NumberToBranch(BranchGo(lucunnum, 0, 0)), 3);
			this.setStar('力士', NumberToBranch(BranchGo(lucunnum, 1, 0)), 3);
			this.setStar('青龙', NumberToBranch(BranchGo(lucunnum, 2, 0)), 3);
			this.setStar('小耗', NumberToBranch(BranchGo(lucunnum, 3, 0)), 3);
			this.setStar('将军', NumberToBranch(BranchGo(lucunnum, 4, 0)), 3);
			this.setStar('奏书', NumberToBranch(BranchGo(lucunnum, 5, 0)), 3);
			this.setStar('飞廉', NumberToBranch(BranchGo(lucunnum, 6, 0)), 3);
			this.setStar('喜神', NumberToBranch(BranchGo(lucunnum, 7, 0)), 3);
			this.setStar('病符', NumberToBranch(BranchGo(lucunnum, 8, 0)), 3);
			this.setStar('大耗', NumberToBranch(BranchGo(lucunnum, 9, 0)), 3);
			this.setStar('伏兵', NumberToBranch(BranchGo(lucunnum, 10, 0)), 3);
			this.setStar('官符', NumberToBranch(BranchGo(lucunnum, 11, 0)), 3);
		}
		
		console.log("6.10安置博士十二诸曜完毕");

		//安长生十二神
		var changsheng;
		var changshengnum;
		changsheng = changshenglist[this.getFivenum()];
		changshengnum = BranchToNumber(changsheng);

		if((this.sexyy == "阳男") || (this.sexyy == "阴女")) {
			this.setStar('长生', changsheng, 8);
			this.setStar('沐浴', NumberToBranch(BranchGo(changshengnum, 1, 1)), 8);
			this.setStar('冠带', NumberToBranch(BranchGo(changshengnum, 2, 1)), 8);
			this.setStar('临官', NumberToBranch(BranchGo(changshengnum, 3, 1)), 8);
			this.setStar('帝旺', NumberToBranch(BranchGo(changshengnum, 4, 1)), 8);
			this.setStar('衰', NumberToBranch(BranchGo(changshengnum, 5, 1)), 8);
			this.setStar('病', NumberToBranch(BranchGo(changshengnum, 6, 1)), 8);
			this.setStar('死', NumberToBranch(BranchGo(changshengnum, 7, 1)), 8);
			this.setStar('墓', NumberToBranch(BranchGo(changshengnum, 8, 1)), 8);
			this.setStar('绝', NumberToBranch(BranchGo(changshengnum, 9, 1)), 8);
			this.setStar('胎', NumberToBranch(BranchGo(changshengnum, 10, 1)), 8);
			this.setStar('养', NumberToBranch(BranchGo(changshengnum, 11, 1)), 8);
		} else {
			this.setStar('长生', changsheng, 8);
			this.setStar('沐浴', NumberToBranch(BranchGo(changshengnum, 1, 0)), 8);
			this.setStar('冠带', NumberToBranch(BranchGo(changshengnum, 2, 0)), 8);
			this.setStar('临官', NumberToBranch(BranchGo(changshengnum, 3, 0)), 8);
			this.setStar('帝旺', NumberToBranch(BranchGo(changshengnum, 4, 0)), 8);
			this.setStar('衰', NumberToBranch(BranchGo(changshengnum, 5, 0)), 8);
			this.setStar('病', NumberToBranch(BranchGo(changshengnum, 6, 0)), 8);
			this.setStar('死', NumberToBranch(BranchGo(changshengnum, 7, 0)), 8);
			this.setStar('墓', NumberToBranch(BranchGo(changshengnum, 8, 0)), 8);
			this.setStar('绝', NumberToBranch(BranchGo(changshengnum, 9, 0)), 8);
			this.setStar('胎', NumberToBranch(BranchGo(changshengnum, 10, 0)), 8);
			this.setStar('养', NumberToBranch(BranchGo(changshengnum, 11, 0)), 8);

		}


		
		
		console.log("6.11安置长生十二诸曜完毕");

		//安四化星
		for(var s in this.skystarlist) {

			if(this.skystarlist[s].name == fourfloadlist[0][stemnum]) {
				this.skystarlist[s].sihua = '禄';
				console.log("化禄 是 " + this.skystarlist[s].name);
			}

			if(this.skystarlist[s].name == fourfloadlist[1][stemnum]) {
				this.skystarlist[s].sihua = '权';
				console.log("化权 是 " + this.skystarlist[s].name);
			}

			if(this.skystarlist[s].name == fourfloadlist[2][stemnum]) {

				console.log("化科 是 " + this.skystarlist[s].name);
				this.skystarlist[s].sihua = '科';
			}

			if(this.skystarlist[s].name == fourfloadlist[3][stemnum]) {
				this.skystarlist[s].sihua = '忌';
				console.log("化忌 是 " + this.skystarlist[s].name);
			}

		}
		
		console.log("6.12安置四化星完毕");
		
		console.log("6.设置诸星完毕");
		console.log("<--------------");
		
		//安庙陷
		var temp;
		for(var s in this.skystarlist) {
//			console.log("s,BranchToNumber(s.branch)" + s +" : " + this.skystarlist[s].branch);
			
			for(var b in brightnesslist) {
				if(this.skystarlist[s].name == brightnesslist[b][12]) {
//					console.log("找到这个星了,设置庙陷:" + this.skystarlist[s].name);
					this.skystarlist[s].brightness = brightnesslist[b][BranchToNumber(this.skystarlist[s].branch)];	
				} 
			}
		}
		
		
		console.log("7.设置诸星庙陷完毕");
		
		this.mMaster = mMasterlist[BranchToNumber(this.branch)];
		this.sMaster = sMasterlist[BranchToNumber(this.branch)];
		
		console.log("8.设置命主身主完毕");
		
		//计算自化星耀
		this.calculateZihua();
		console.log("9.设置自化星耀完毕");
		
		//计算化冲星耀
		this.calculateChong();
		console.log("10.设置化冲星耀完毕");
		
		console.log(this);
		console.log("------------命盘计算完毕------------");
	},
 

	//大限的流魁钺昌曲羊驼禄马以及流四化的位置
	//stem,branch,该大限的干支
	setLongtime:function(stem,branch){
		
		var stemnum = StemToNumber(stem);
		var branchnum = BranchToNumber(branch);
		
		var timenum;
		
		console.log("A.设置大限开始...");
		
		//设置流曜
		this.setLTStar('运禄', stemsetlist[0][stemnum]);
		this.setLTStar('运羊', stemsetlist[1][stemnum]);
		this.setLTStar('运陀', stemsetlist[2][stemnum]);
		this.setLTStar('运鉞', stemsetlist[3][stemnum]);
		this.setLTStar('运魁', stemsetlist[4][stemnum]);
		this.setLTStar('运马', branchsetlist[0][branchnum], 1);
		this.setLTStar('运昌', LiuChangQulist[0][stemnum], 1);
		this.setLTStar('运曲', LiuChangQulist[1][stemnum], 1);
		
		//设置化流曜
		for(var s in this.skystarlist) {

			if(this.skystarlist[s].name == fourfloadlist[0][stemnum]) {
				this.skystarlist[s].ltff = '禄';
				console.log("化流禄 是 " + this.skystarlist[s].name);
			}

			if(this.skystarlist[s].name == fourfloadlist[1][stemnum]) {
				this.skystarlist[s].ltff = '权';
				console.log("化流权 是 " + this.skystarlist[s].name);
			}

			if(this.skystarlist[s].name == fourfloadlist[2][stemnum]) {

				console.log("化流科 是 " + this.skystarlist[s].name);
				this.skystarlist[s].ltff = '科';
			}

			if(this.skystarlist[s].name == fourfloadlist[3][stemnum]) {
				this.skystarlist[s].ltff = '忌';
				console.log("化流忌 是 " + this.skystarlist[s].name);
			}

		}
		console.log("A.1 诸流曜设置完毕");
		
		//设置各个宫度的大限宫度名
		for(var i = 0;i<12;i++ ) {
			this.skyastrolabe[BranchGo(BranchToNumber(branch),i,1)].ltname = longtimetemplatenamelist[i];
		}
		
		console.log("A.2 诸大限宫名设置完毕");
		
		//得出大运第一年的年份
		var firstyear = parseInt(this.birthday.year) + parseInt(this.skyastrolabe[BranchToNumber(branch)].longtimestart) - 1;
		
		console.log("firstyear = " + firstyear +"   birthday = " + this.birthday.year);
		console.log("longtimestart:longtimeend = " + this.skyastrolabe[BranchToNumber(branch)].longtimestart + " : " +this.skyastrolabe[BranchToNumber(branch)].longtimeend);
		
		//设置该大运的每宫度年份值,10个,不是12个

		var t = calendar.solar2lunar4(firstyear,6,1,12);
		
		for(var i = 0;i<10;i++){
			
			var ti = calendar.solar2lunar4(firstyear+i,6,1,12);
			
			this.skyastrolabe[BranchToNumber(ti.gzYear[1])].ytime = parseInt(firstyear + i) + '年';
			this.skyastrolabe[BranchToNumber(ti.gzYear[1])].yage = firstyear - this.birthday + i;
			this.skyastrolabe[BranchToNumber(ti.gzYear[1])].ystem = ti.gzYear[0];
			this.skyastrolabe[BranchToNumber(ti.gzYear[1])].ybranch = ti.gzYear[1];
		}
		
		console.log("A.3 诸宫流年时间以及流年干支设置完毕");
		console.log("A. 大限设置完毕");
	},
	
	//清除所有大限流曜,以及大限流年
	clearLongtime:function(){
		for(var t in this.skyastrolabe) {
			this.skyastrolabe[t].ltstarlist.splice(0,this.skyastrolabe[t].ltstarlist.length);
			
			for(var m in this.skyastrolabe[t].Astarlist) {
				this.skyastrolabe[t].Astarlist[m].ltff = '无';
			}
			
			this.skyastrolabe[t].ytime = '';
			this.skyastrolabe[t].yage = '';
			
		}
	},
	
	

	
	//流年的流魁钺昌曲羊驼禄马以及流四化的位置
	//stem,branch,该流年的干支
	setYeartime:function(stem,branch){
		
		var stemnum = StemToNumber(stem);
		var branchnum = BranchToNumber(branch);
		
		var timenum;
		
		//设置流曜
		this.setYStar('年禄', stemsetlist[0][stemnum]);
		this.setYStar('年羊', stemsetlist[1][stemnum]);
		this.setYStar('年陀', stemsetlist[2][stemnum]);
		this.setYStar('年鉞', stemsetlist[3][stemnum]);
		this.setYStar('年魁', stemsetlist[4][stemnum]);
		this.setYStar('年马', branchsetlist[0][branchnum], 1);
		this.setYStar('年昌', LiuChangQulist[0][stemnum], 1);
		this.setYStar('年曲', LiuChangQulist[1][stemnum], 1);
		
		//设置化流曜
		for(var s in this.skystarlist) {

			if(this.skystarlist[s].name == fourfloadlist[0][stemnum]) {
				this.skystarlist[s].yff = '禄';
				console.log("年化流禄 是 " + this.skystarlist[s].name);
			}

			if(this.skystarlist[s].name == fourfloadlist[1][stemnum]) {
				this.skystarlist[s].yff = '权';
				console.log("年化流权 是 " + this.skystarlist[s].name);
			}

			if(this.skystarlist[s].name == fourfloadlist[2][stemnum]) {

				console.log("年化流科 是 " + this.skystarlist[s].name);
				this.skystarlist[s].yff = '科';
			}

			if(this.skystarlist[s].name == fourfloadlist[3][stemnum]) {
				this.skystarlist[s].yff = '忌';
				console.log("年化流忌 是 " + this.skystarlist[s].name);
			}
		}
		
		//设置宫度的流年宫度名
		for(var i = 0;i<12;i++){
			this.skyastrolabe[BranchGo(BranchToNumber(branch),i,1)].yname = yeartemplatenamelist[i];
		}

		//设置各宫流月命宫月份信息
		this.setMonthtimeByYear(branch);
	},

	//根据流年地支，计算每个宫位对应的流月命宫月份
	setMonthtimeByYear:function(branch){
		var branchnum = BranchToNumber(branch);
		if(branchnum == -1) {
			console.log("设置流月命宫地支错误!!!branch = " + branch);
			return 0;
		}

		this.clearMonthtime();

		function normalizeRoleName(name) {
			var text = String(name || '');
			if(text.indexOf('|') !== -1) {
				text = text.split('|')[0];
			}
			text = text.replace('宫', '');
			var roleMap = {
				'命':'命',
				'父':'父母',
				'福':'福德',
				'田':'田宅',
				'事':'事业',
				'官':'事业',
				'友':'交友',
				'迁':'迁移',
				'疾':'疾厄',
				'财':'财帛',
				'子':'子女',
				'夫':'夫妻',
				'妻':'夫妻',
				'兄':'兄弟',
				'父母':'父母',
				'福德':'福德',
				'田宅':'田宅',
				'事业':'事业',
				'官禄':'事业',
				'交友':'交友',
				'迁移':'迁移',
				'疾厄':'疾厄',
				'财帛':'财帛',
				'子女':'子女',
				'夫妻':'夫妻',
				'兄弟':'兄弟'
			};
			return roleMap[text] || text;
		}

		// 以原局寅宫宫职为准，找到对应的流年宫职作为正月
		var yinIndex = BranchToNumber('寅');
		var yinPalace = this.skyastrolabe[yinIndex];
		var yinRole = normalizeRoleName(yinPalace ? yinPalace.name : '');
		var roleIndex = -1;
		for(var r = 0; r < templatenamelist.length; r++) {
			if(normalizeRoleName(templatenamelist[r]) === yinRole) {
				roleIndex = r;
				break;
			}
		}

		var targetYearRole = roleIndex >= 0 ? yeartemplatenamelist[roleIndex] : '';
		var januaryIndex = -1;
		if(targetYearRole) {
			for(var p = 0; p < 12; p++) {
				if(this.skyastrolabe[p].yname === targetYearRole) {
					januaryIndex = p;
					break;
				}
			}
		}

		if(januaryIndex == -1) {
			januaryIndex = branchnum;
		}

		for(var i = 0;i<12;i++){
			var palaceIndex = BranchGo(januaryIndex,i,1);
			this.skyastrolabe[palaceIndex].mname = '月命';
			this.skyastrolabe[palaceIndex].mtime = calendar.toChinaMonth(i + 1);
			this.skyastrolabe[palaceIndex].mbranch = this.skyastrolabe[palaceIndex].branch;
		}

		return 1;
	},
	
	//清除所有流年流曜
	clearYeartime:function(){
		for(var t in this.skyastrolabe) {
			this.skyastrolabe[t].ystarlist.splice(0,this.skyastrolabe[t].ystarlist.length);
			
			for(var m in this.skyastrolabe[t].Astarlist) {
				this.skyastrolabe[t].Astarlist[m].yff = '无';
			}
		}

		this.clearMonthtime();
	},

	//清除所有流月信息
	clearMonthtime:function(){
		for(var t in this.skyastrolabe) {
			if(this.skyastrolabe[t].mstarlist && this.skyastrolabe[t].mstarlist.length) {
				this.skyastrolabe[t].mstarlist.splice(0,this.skyastrolabe[t].mstarlist.length);
			}
			this.skyastrolabe[t].mname = '';
			this.skyastrolabe[t].mtime = '';
			this.skyastrolabe[t].mstem = '';
			this.skyastrolabe[t].mbranch = '';
		}
	},

	// 获取坐命主星，如果没有则取对宫迁移
	getMingGongStars:function(){
		
		// 查找命宫
		let mingGong = null;
		let qianGong = null;

		for (let i = 0; i < this.skyastrolabe.length; i++) {
			// 这里包含命字就可以了
			if (this.skyastrolabe[i].name.indexOf('命') !== -1) {
				mingGong = this.skyastrolabe[i];
				console.log('找到命宫：', mingGong.Jstarlist)
			}

			// 这里包含迁字就可以了
			if (this.skyastrolabe[i].name.indexOf('迁') !== -1) {
				qianGong = this.skyastrolabe[i];
				console.log('找到迁宫：', qianGong.Jstarlist)
			} 
		}
		
		if (!mingGong) {
			throw new Error('未能找到命宫');
		}

		
		
		// 获取命宫中的乙级星（包含六煞）
		const badStars = mingGong.sixdemonlist ? mingGong.sixdemonlist.map(star => star.name) : [];
		const goodStars = mingGong.Ystarlist ? mingGong.Ystarlist.map(star => star.name) : [];
		const secondaryStars = goodStars.concat(badStars)

		
		// 获取命宫中的甲级星
		let mainStars = mingGong.Jstarlist ? mingGong.Jstarlist.map(star => star.name) : [];
		let mainStars_sihua = [];
		let sihuas = [];
		let zihuas = [];

		// 如果命宫的甲级星不存在，则使用迁移宫替代
		if (!mainStars.length && qianGong) {
			mainStars = qianGong.Jstarlist ? qianGong.Jstarlist.map(star => star.name) : [];
		}

		//针对甲级星，需要获取其是否有四化或者自化
		for(let star of mainStars){
			let starObj = this.skystarlist.find(s => s.name === star);
			if(starObj){
				if(starObj.sihua !== '无' && starObj.zihua !== '无'){
					let sihua = starObj.sihua;
					let zihua = starObj.zihua;
					mainStars_sihua.push(star + '化' + sihua + '且' + zihua);
					sihuas.push('化'+sihua)
					zihuas.push(zihua)
				} else if(starObj.sihua !== '无'){
					let sihua = starObj.sihua;
					mainStars_sihua.push(star + '化' + sihua);
					sihuas.push('化'+sihua)
				} else if(starObj.zihua !== '无'){
					let zihua = starObj.zihua;
					mainStars_sihua.push(star + zihua);
					zihuas.push(zihua)
				} else {
					mainStars_sihua.push(star);
				}

				console.log('starObj：', starObj);
			}
		}

		console.log('mainStars_sihua', mainStars_sihua);

		// 获取命宫中的甲乙级星
		const allStars = mainStars_sihua.concat(secondaryStars);
			
		return {
			// 主星（不含四化）
			mainStars: mainStars,
			// 主星（包含四化）
			mainStars_sihua: mainStars_sihua,
			// 四化
			sihua: sihuas,
			// 自化
			zihua: zihuas,
			// 辅星
			secondaryStars: secondaryStars,
			// 主星（包含四化）+ 辅星
			allStars: allStars,
		};
	}
	
};
