function store() {
    this.products = [

        new product(1,"Dell Vostro 2520",31990,"https://img1a.flixcart.com//image/computer/9/j/s/dell-vostro-notebook-125x125-imadhjwhzkxagjat.jpeg",
        "http://img5a.flixcart.com/image/computer/9/j/s/dell-vostro-notebook-400x400-imadhjwhvhgt5hys.jpeg",4,
        ["Core i3 (3rd Gen)","500 GB HDD","4 GB DDR3 RAM","Ubuntu"]),
        new product(2,"Apple MacBook Air",674900,"http://img5a.flixcart.com/image/computer/h/7/e/apple-macbook-air-notebook-125x125-imadnat64rts2aj9.jpeg",
            "http://img5a.flixcart.com/image/computer/h/7/e/apple-macbook-air-notebook-400x400-imadnat64rts2aj9.jpeg",5,
            ["Core i5 (4th Gen)","128 GB SSD","4 GB DDR3 RAM","Mac OS X Mountain Lion"]),
        new product(4,"HP Pavillion 15",38000,"http://img6a.flixcart.com/image/computer/n/d/g/hp-pavilion-notebook-125x125-imadp2b4uudbyaj7.jpeg",
        "http://img6a.flixcart.com/image/computer/n/d/g/hp-pavilion-notebook-400x400-imadp2b4uudbyaj7.jpeg",4,
        ["APU Quad Core A10","1 TB HDD","8 GB DDR3 RAM","Free DOS"]),
        new product(5,"Dell Inspiron 15",33590,"http://img6a.flixcart.com/image/computer/b/g/r/dell-inspiron-notebook-125x125-imadhz455huhguxg.jpeg",
        "http://img6a.flixcart.com/image/computer/b/g/r/dell-inspiron-notebook-400x400-imadhz455huhguxg.jpeg",5,
        ["Core i3 (3rd Gen)","500 GB HDD","4 GB DDR3 RAM","Windows 8"]),
        new product(6,"Acer Aspire V5-123",22990,"http://img5a.flixcart.com/image/computer/u/b/b/acer-aspire-v5-123-netbook-125x125-imadqsgqwnyse4es.jpeg",
        "http://img6a.flixcart.com/image/computer/g/w/e/acer-aspire-v5-netbook-v5-123-400x400-imadtrg496xhzhmv.jpeg",4,
        ["APU Dual Core","500 GB HDD","4 GB DDR3 RAM","Windows 8"]),
        new product(7,"HP Envy 15",62400,"http://img6a.flixcart.com/image/computer/s/g/h/hp-envy-notebook-15-j110tx-125x125-imadsecyrgy3y4gz.jpeg",
        "http://img6a.flixcart.com/image/computer/s/g/h/hp-envy-notebook-15-j110tx-400x400-imadsecyrgy3y4gz.jpeg",3,
        ["Core i5 (4th Gen)","8 GB DDR3 RAM","1 TB HDD","Windows 8.1"]),
        new product(8,"Lenovo Ideapad Y510",65490,"http://img5a.flixcart.com/image/computer/e/4/6/lenovo-ideapad-notebook-125x125-imadz5yutejhc68z.jpeg",
        "http://img5a.flixcart.com/image/computer/e/4/6/lenovo-ideapad-notebook-400x400-imadz5yutejhc68z.jpeg",5,
        ["Core i7 (4th Gen)","8 GB DDR3 RAM","1 TB HDD","Windows 8"]),
       new product(10,"Lenovo Essentials G500",38790,"http://img6a.flixcart.com/image/computer/j/a/z/lenovo-essential-notebook-g500-59-370339-125x125-imadnzz3jnywaxhe.jpeg",
        "http://img6a.flixcart.com/image/computer/j/a/z/lenovo-essential-notebook-g500-59-370339-400x400-imadnzz3jnywaxhe.jpeg",5,
        ["Core i5 (3rd Gen)","4 GB DDR3 RAM","500 GB HDD","Free DOS"])
    ];

    store.prototype.getProduct = function(id) {
        for (var i = 0; i < this.products.length; i++) {
            if (this.products[i].id == id)
                return this.products[i];
        }
        return null;
    }
}