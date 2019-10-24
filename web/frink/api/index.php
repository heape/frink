<?php

class Utils {
    function request($url, $headers, $method = 'GET', $body = '')
    {
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_CUSTOMREQUEST, $method);
        curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_HEADER, false);
        curl_setopt($curl, CURLOPT_ENCODING , 'deflate');
        curl_setopt($curl, CURLOPT_ENCODING , 'gzip');
        curl_setopt($curl, CURLOPT_ENCODING , 'br');
        
        $response_body = curl_exec($curl);
        curl_close($curl);

        return array('body' => $response_body);
    }

    function urlencode($url) {
        $matches = array();
        preg_match('/((http|https):\/\/.*?\/)(.*)/', $url, $matches, PREG_OFFSET_CAPTURE);

        $pattern = array('/%26/', '/%2F/', '/%3D/', '/%3F/');
        $replace = array('&', '/', '=', '?');
        $part = preg_replace($pattern, $replace, urlencode($matches[3][0]));

        return $matches[1][0].$part;
    }
}

class Mercari {
    function compute($json, $base_amount) {
        $basePrice = intval($base_amount); //45000;
        $reverse = 1;
        $diffPrices = array();

        $results = array('items' => array());
        foreach($json['data'] as $item) {
            if($reverse == 0 && $item['price'] > $basePrice) {
                $diff = $item['price'] - $basePrice;
                array_push($diffPrices, array('extra' => array('diff' => $diff), 'item' => $item));
            } else if($reverse == 1 && $item['price'] < $basePrice) {
                $diff = $item['price'] - $basePrice;
                array_push($diffPrices, array('extra' => array('diff' => $diff), 'item' => $item));
            }
        }

        //ソート
        usort($diffPrices, function ($a, $b) {
            return $a['extra']['diff'] - $b['extra']['diff'];
            //逆順の場合はこっち
            //return  $a['price'] > $b['price'] ? -1 : 1;
        });    
        $sortedDiff = $diffPrices;
        return $sortedDiff;
    }
}

class Rakuma {
    function compute($json, $base_amount) {
        $basePrice = intval($base_amount); //45000;
        $reverse = 1;
        $diffPrices = array();

        $results = array('items' => array());

        foreach($json['items'] as $item) {
            if($reverse == 0 && $item['price'] > $basePrice) {
                $diff = $item['price'] - $basePrice;
                array_push($diffPrices, array('extra' => array('diff' => $diff), 'item' => $item));
            } else if($reverse == 1 && $item['price'] < $basePrice) {
                $diff = $item['price'] - $basePrice;
                array_push($diffPrices, array('extra' => array('diff' => $diff), 'item' => $item));
            }
        }

        //ソート
        usort($diffPrices, function ($a, $b) {
            return $a['extra']['diff'] - $b['extra']['diff'];
            //逆順の場合はこっち
            //return  $a['price'] > $b['price'] ? -1 : 1;
        });    
        $sortedDiff = $diffPrices;
        return $sortedDiff;
    }
}

$utils = new Utils;
$mercari = new Mercari;
$rakuma = new Rakuma;

function fnMercari($utils, $mercari) {
    $url = 'https://api.mercari.jp/search_index/search?';

    $params = array('keyword' => $_GET['query']/*'CUH-2100AB01 PS4'*/,
                    'category_id' => $_GET['categories'],
                    'brand_id' => $_GET['brands'],
                    'item_condition_id' => '1',
                    'status' => 'on_sale',
                    'sort' => 'created_time',
                    'order' => 'desc',
                    'limit' => '20',
                    'tr_search_type' => 'filter',
                    'max_pager_id' => '0');

    foreach($params as $key => $value) {
        $url .= $key. '='. $value. '&';
    } 
    $url = substr($url, 0, strlen($url) - 1);

    //$url = str_replace('query_value', $request->input('query'), $url);

    $url = $utils->urlencode($url);

    $headers = [
        'Accept: application/json',
        'User-Agent: Mercari_r/1482 (Android 22; ja; x86,armeabi-v7a; samsung SM-N9005 Build/5.1.1) DB/13',
        'X-PLATFORM: android',
        'X-APP-VERSION: 1482',
        'Accept-Encoding: gzip, deflate',
        'Authorization: 2:7b1d004962472bdef1defb3347d1b9ce8d729bc76538760222dc7ac94cefe3ef'
    ];

    $response = $utils->request($url, $headers, 'GET');
    $results = $mercari->compute(json_decode($response['body'], true), $_GET['base_amount']);

    return json_encode(array('response' => $results));
}

function fnRakuma($utils, $rakuma) {
    $url = 'https://api.fril.jp/api/v3/items/search/open?';

    $params = array('query' => $_GET['query']/*'CUH-2100AB01 PS4'*/,
                    'category_ids' => $_GET['categories'],
                    'brand_id' => $_GET['brands'],
                    'statuses' => '5',
                    'transaction' => 'selling',
                    'sort' => 'item_id',
                    'last_id' => '0',
                    'page' => '1');

    foreach($params as $key => $value) {
        $url .= $key. '='. $value. '&';
    } 
    $url = substr($url, 0, strlen($url) - 1);

    //$url = str_replace('query_value', $request->input('query'), $url);

    $url = $utils->urlencode($url);

    $headers = [
        'Accept-Encoding: '.            'gzip, deflate',
        'User-Agent: '.                 'Fril/7.10.1 (SM-N9005; Android 5.1.1; Scale/1.5; Screen/720x1280)',
    ];

    $response = $utils->request($url, $headers, 'GET');
    $results = $rakuma->compute(json_decode($response['body'], true), $_GET['base_amount']);

    header('Content-Type: application/json');
    echo json_encode(array('response' => $results));
}
/*
if($_GET['website'] === 'mercari') {
    header('Content-Type: application/json');
    echo fnMercari($utils, $mercari);
} else if($_GET['website'] === 'rakuma') {
    header('Content-Type: application/json');
    echo fnRakuma($utils, $rakuma);
} else*/ if($_GET['frimashop'] === 'rakuma') {
    header('Content-Type: application/json');
    echo fnRakuma($utils, $rakuma);
} else if($_GET['frimashop'] === 'rakuma') {
    header('Content-Type: application/json');
    echo fnRakuma($utils, $rakuma);
}
//fnRakuma($utils, $rakuma);