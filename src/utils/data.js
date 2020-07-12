import Vue from 'vue';
import md5 from 'md5';

let basePms = new Vue({
    methods: {
        get: function () {
            let base = {
                ti: ~~(new Date().getTime()/1000),
                im: "17862898501",
                username: "17862898501",
                sk: "898501",
                // im: "123456789",
                // username: "014",
                // sk: "123456"
            }
            base.es = md5(base.im+base.ti+base.sk).slice(0,6);
            return base;
        }
    }
})

export default basePms;
