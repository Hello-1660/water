<script setup lang="ts">
import { ref } from 'vue'
import Clock from '../components/Clock.vue'
import SecondWatch from '../components/SecondWatch.vue'


const isShow = ref(0)

</script>


<template>
    <div class="container">
        <div class="return" v-show="isShow !== 0" @click="isShow = 0">
            <svg t="1769431872810" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="26120"><path d="M480 64C214.912 64 0 278.912 0 544c0 265.088 214.912 480 480 480 265.088 0 480-214.912 480-480 0-265.088-214.912-480-480-480z m85.12 649.024c12.48 12.48 12.48 32.768 0 45.248-6.272 6.272-14.464 9.344-22.656 9.344s-16.384-3.136-22.656-9.344L328.32 566.656c-12.48-12.48-12.48-32.768 0-45.248l192.768-192.832c12.48-12.48 32.768-12.48 45.248 0s12.48 32.768 0 45.248l-170.112 170.24 168.896 168.96z" p-id="26121"></path></svg>
        </div>

        <div v-if="isShow === 0" class="choose container-size">
            <div class="container-btn" @click="isShow = 1">
                <svg t="1769431095758" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="16026"><path d="M0 0h1024v1024H0z" fill="#FFFFFF" fill-opacity="0" p-id="16027"></path><path d="M772.266667 339.754667l61.141333-61.141334a32 32 0 1 0-45.269333-45.269333l-63.061334 63.061333a349.397333 349.397333 0 0 0-180.992-70.784V160H597.333333a32 32 0 1 0 0-64h-170.666666a32 32 0 0 0 0 64h53.333333v65.621333a352.981333 352.981333 0 1 0 292.181333 114.133334h0.085334zM512 864a288 288 0 1 1 288-288A288.341333 288.341333 0 0 1 512 864z m110.293333-201.344a32 32 0 1 1-49.962666 40.021333l-85.333334-106.666666a32.128 32.128 0 0 1-7.04-20.010667V426.666667a32 32 0 1 1 64 0v138.112l78.336 97.877333z"p-id="16028"></path></svg>
            </div>

 
            <div class="container-btn" @click="isShow = 2">
                <svg t="1769431271214" class="icon2" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="22677"><path d="M430.867692 492.071385c-19.140923-25.521231-51.042462-51.042462-76.563692-70.183385C271.36 351.625846 194.796308 281.442462 181.956923 77.193846H156.514462C137.373538 77.193846 118.232615 58.052923 118.232615 38.912S137.373538 0.630154 156.514462 0.630154h708.135384c19.140923 0 38.281846 19.140923 38.281846 38.281846S883.790769 77.193846 864.649846 77.193846h-25.521231c-6.301538 204.248615-89.324308 268.051692-172.268307 344.694154-25.521231 19.140923-51.042462 44.662154-76.563693 70.183385 25.521231 25.521231 51.042462 51.042462 76.563693 70.183384 82.944 70.262154 165.888 140.445538 172.268307 344.694154h25.521231c19.140923 0 38.281846 19.140923 38.281846 38.281846 0 19.219692-19.140923 38.360615-38.281846 38.360616H156.514462c-19.140923 0-38.281846-19.140923-38.281847-38.360616 0-19.140923 19.140923-38.281846 38.281847-38.281846h25.52123c6.301538-204.248615 89.324308-268.051692 172.268308-344.694154 25.521231-19.140923 57.422769-44.662154 76.563692-70.104615z m-172.268307 414.877538h31.901538L494.670769 702.700308c6.301538-6.301538 25.442462-6.301538 31.822769 0l204.169847 204.248615h31.901538c-6.301538-172.347077-76.563692-223.389538-146.747077-287.192615-31.901538-31.901538-70.104615-57.501538-102.006154-102.163693-38.281846 44.662154-70.183385 70.262154-108.46523 102.163693-70.183385 63.803077-140.366769 114.845538-146.747077 287.192615z m63.803077-631.886769h389.12c31.901538-44.662154 57.501538-102.163692 57.501538-197.868308h-510.424615c6.301538 95.704615 25.521231 153.206154 63.803077 197.868308z" p-id="22678"></path></svg>          
            </div>
        </div>

        <Clock v-if="isShow === 1" class="container-size" />
        <SecondWatch v-if="isShow === 2" class="container-size" />
    </div>
</template>

<style scoped>
* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

.container {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
}

.return {
    position: absolute;
    top: 20px;
    left: 20px;
    width: 60px;
    height: 60px;
}

.return>svg {
    visibility: hidden;
    width: 100%;
    height: 100%;
    fill: #aaaaaa;
}

.return:hover >svg {
    visibility: visible;
}


.choose {
    display: flex;
    justify-content: space-around;
    align-items: center;
    /* background-color: pink; */
}

.choose>div {
    cursor: pointer;
}


.choose>div:first-child {
    margin-right: 100px;
}

.choose>div:last-child {
    display: flex;
    justify-content: center;
    align-items: center;
}

.container-btn {
    width: 400px;
    height: 400px;
    border-radius: 40px;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.126);
}

.container-btn>.icon {
    width: 100%;
    height: 100%;
    fill: #aaaaaa;
}

.container-btn>.icon:hover {
    fill: #3d3d3d;
}

.icon2 {
    width: 90%;
    height: 90%;
    fill: #aaaaaa;
}

.icon2:hover {
    fill: #3d3d3d;
}

.container-size {
    width: 80%;
    height: 80%;
}
</style>