// ==UserScript==
// @name         BSC/TX
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       guckt
// @match        https://bscscan.com/tx/*
// @icon         https://www.google.com/s2/favicons?domain=google.com
// @grant        none
// ==/UserScript==

$(document).ready(function() {

    var tickers = [];
    var tokens = [];
    var addresses = [];

    var APIpullTotal = 1000;
    var APIdisplayed = 200;

    let filteredAddresses = [];
    var pairAddress = "";

    var address = [];

    var decimal;

    //var projectMatches = [];
    //var matchHoldings = [];

    var ignore =['0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c', //WBNB
                 '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82', //CAKE
                 '0xe9e7cea3dedca5984780bafc599bd69add087d56', //BUSD
                 '0x2170ed0880ac9a755fd29b2688956bd959f933f8', //B-ETH
                 '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d', //B-USDC
                 '0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3', //B-DAI
                 '0x3ee2200efb3400fabb9aacf31297cbdd1d435d47', //B-ADA
                 '0x55d398326f99059ff775485246999027b3197955', //B-BUSD
                 '0x10ed43c718714eb63d5aa57b78b54704e256024e', //Pancakeswap LP
                 '0x0000000000000000000000000000000000000000', //Burn
                 '0x0000000000000000000000000000000000000001', //Burn
                 '0x000000000000000000000000000000000000dead']; //Burn

    var contract = false;

    const loader = document.createElement("div");

    if (TransactionType())
    return;

    Loading(loader);



    for (let i = 1; i < 10; i++) {
        let totalSelector = document.querySelectorAll("#wrapperContent > li:nth-child("+i+") > div > a")

        for (let k = 0; k < totalSelector.length; k++) {
            if (k == totalSelector.length- 1) {

                var href = $(totalSelector[k]).attr('href');
                var address = jQuery.trim(href).substring(7)
                .trim(this);


                if (ignore.indexOf(address) == -1)
                {
                    var ticker
                    var token
                    var element = totalSelector[k].outerHTML;

                    //console.info("round " + i + ": " + totalSelector[k].childNodes.length);
                    if ((totalSelector[k].childNodes.length) == 1) {
                        token = element.substring(
                            element.indexOf(">") + 1,
                            element.lastIndexOf("(")
                        );
                        ticker = element.substring(
                            element.indexOf("(") + 1,
                            element.lastIndexOf(")")
                        );
                    }
                    else if ((totalSelector[k].childNodes.length) == 2){
                        token = totalSelector[k].childNodes[0].getAttribute("data-original-title");
                        ticker = element.substring(
                            element.indexOf("(") + 1,
                            element.lastIndexOf(")")
                        );
                    }
                    else if ((totalSelector[k].childNodes.length) == 3){
                        token = element.substring(
                            element.indexOf(">") + 1,
                            element.lastIndexOf("(")
                        );
                        ticker = totalSelector[k].childNodes[1].getAttribute("data-original-title");
                    }
                    else if ((totalSelector[k].childNodes.length) == 4){
                        token = totalSelector[k].childNodes[0].getAttribute("data-original-title");
                        ticker = totalSelector[k].childNodes[2].getAttribute("data-original-title")
                    }

                    tickers[i] = ticker;
                    tokens[i] = token;
                    addresses[i] = address;

                    $(totalSelector[k].parentNode).append('<input type="button" value="X" id="BT'+i+'" >')
                    //$("#BT").css("position", "fixed").css("top", 1).css("left", 100);
                    $("#BT"+i).css("margin-left", "5px");
                    $("#BT"+i).css("border-radius", "16px");
                    $("#BT"+i).css("color", "DodgerBlue");
                    $("#BT"+i).css("background", "white");
                    $("#BT"+i).css("border-color", "DodgerBlue");
                    $("#BT"+i).click(function(){
                        window.open('https://web.telegram.org/z/');
                        window.open('https://twitter.com/search?q=%22' + addresses[i] + '%22&src=typed_query&f=live');
                        window.open('https://twitter.com/search?q=%22' + tokens[i] + '%22&src=typed_query&f=live');
                        window.open('https://twitter.com/search?q=%22' + '$' + tickers[i] + '%22&src=typed_query&f=live');
                        //}
                        //window.location = current;
                    });
                }
            }
        }
    }

    var itemNumber = 0;
    var removeUndefined = addresses.filter(item => { return item !== undefined });
    var removeDuplicates = [...new Set(removeUndefined)]
    filteredAddresses = removeDuplicates.filter(function (item) {
        return item.indexOf("s") !== 0;
    });

    //console.log(addresses);
    console.log(filteredAddresses);
  if (filteredAddresses.length == 0)
    {
      Progress("No tokens exchanged");
      throw new Error();
    }

  Progress("Creating HUD...");
  Chart(filteredAddresses, itemNumber);
  Purchase(filteredAddresses, itemNumber);

  GetPair(filteredAddresses[itemNumber], pairAddress, contract, APIpullTotal, APIdisplayed, ignore);

});

function Chart(filteredAddresses, itemNumber){

  if (filteredAddresses.length > 1) {
        $("#ContentPlaceHolder1_maintable > div:nth-child(11) > div.col-md-3.font-weight-bold.font-weight-sm-normal.mb-1.mb-md-0")
          .append('<input type="button" value="NEXT" id="NB" >')
        //$("#BT").css("position", "fixed").css("top", 1).css("left", 100);
        $("#NB").css("position", "absolute").css("bottom", 5).css("left", 10);
        //$("#NB").css("border-radius", "15px")
        $("#NB").css("margin", "5px");
        $("#NB").css("width", "100px");
        $("#NB").css("color", "DodgerBlue");
        $("#NB").css("background", "white");
        $("#NB").css("border-color", "DodgerBlue");
        $("#NB").click(function(){
            itemNumber = itemNumber + 1;
            itemNumber = itemNumber % filteredAddresses.length;
            Chart(filteredAddresses, itemNumber);
            PurchaseNext(filteredAddresses, itemNumber);

        });
    }

    if (filteredAddresses.length != 0) {
        var chart = document.createElement("iframe");
        chart.setAttribute("src", "https://dexscreener.com/bsc/" + filteredAddresses[itemNumber]);
        chart.setAttribute("id", "dex");

        chart.style.width = "100%";
        chart.style.height = "800px";

        if (document.querySelector("#ContentPlaceHolder1_maintable > iframe:nth-child(12)")){
            document.querySelector("#ContentPlaceHolder1_maintable > iframe:nth-child(12)").replaceWith(chart);
        }
        else {
            document.querySelector("#ContentPlaceHolder1_maintable > hr:nth-child(12)").before(chart);
        }
    }

    Progress("Grabbing Pair, Token & BNB Price...");
}

async function GetPair(filteredAddresses, pairAddress, contract, APIpullTotal, APIdisplayed, ignore)
{

    const query = `
{
  ethereum(network: bsc) {
    pairs: dexTrades(
      baseCurrency: {is: "`+filteredAddresses+`"}
      options: {desc: "trades", limit: 10}
    ) {
      poolToken: smartContract {
        address {
          address
        }
      }
      exchange {
        fullName
      }
      pair: quoteCurrency {
        address
        symbol
      }
      trades: count
    }
     token: dexTrades(
      options: {asc: ["block.height"], limit: 1}
      exchangeName: {in: ["Pancake", "Pancake v2"]}
      baseCurrency: {is: "`+filteredAddresses+`"}
    ) {
      block {
        height
        timestamp {
          unixtime
        }
      }
      baseCurrency {
        decimals
        symbol
      }
    }
     priceBNB: dexTrades(
      options: {desc: ["block.height"], limit: 1}
      exchangeName: {in: ["Pancake", "Pancake v2"]}
      baseCurrency: {is: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c"}
      quoteCurrency: {is: "0xe9e7cea3dedca5984780bafc599bd69add087d56"}
    ) {
      block {
        height
        timestamp {
          unixtime
        }
      }
      baseCurrency {
        decimals
        symbol
      }
      quotePrice
    }
  }
}
    `;

    const url = "https://graphql.bitquery.io/";
    const opts = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
          "X-API-KEY": "BQYJa5pEGcQHG1mupaWJeX4IjahiI8z8"
          //"address": filteredAddresses
        },
        body: JSON.stringify({
            query
        })
    };

    var res = await fetch(url, opts)
        .then(res => res.json())
        .catch(console.error);
        console.log(res)

        pairAddress = (res.data.ethereum.pairs["0"].poolToken.address.address)
        var pairToken = (res.data.ethereum.pairs["0"].pair.address)
        var priceBNB = (res.data.ethereum.priceBNB["0"].quotePrice).toFixed(20)
        console.log(pairToken)
        var decimal = (res.data.ethereum.token["0"].baseCurrency.decimals)
        var startTime = (res.data.ethereum.token["0"].block.timestamp.unixtime)
        //if (res.data.ethereum.price["0"].quotePrice  !== null)


        var price = await TokenPrice(filteredAddresses, pairToken);
        var tokenPrice;

        if ((pairToken == 0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d) || (pairToken == 0x55d398326f99059fF775485246999027B3197955) || (pairToken == 0xe9e7cea3dedca5984780bafc599bd69add087d56))
          tokenPrice = price
        else if (pairToken == 0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c)
          tokenPrice = priceBNB * price

       console.log("TOKEN ADDRESS: " + filteredAddresses);
       console.log("TOKEN PRICE: " + tokenPrice);
       console.log("PAIR ADDRESS: " + pairAddress);
       console.log("BNB PRICE: " + priceBNB);

       console.timeEnd("Finished First Fetch");


      if ((pairAddress == filteredAddresses)||(pairAddress == '0x0000000000000000000000000000000000000000'))
        {
          contract = true;
          console.log("Restarting GetPair...");
          //Progress("Finding Block Fetch...");
          GetPair(filteredAddresses, pairAddress, contract);
        }

      Progress("Filtering " + res.data.ethereum.pairs["0"].trades + " Addresses, Holdings & Times...");

      if (!contract)
        GetData(filteredAddresses, pairAddress, decimal, startTime, tokenPrice, priceBNB, APIpullTotal, APIdisplayed, ignore);
}

async function TokenPrice(filteredAddresses, tokenAddress)
{

  Progress("Calculating Token Price...");

  const query = `
{
  ethereum(network: bsc) {
    price: dexTrades(
      options: {desc: ["block.height"], limit: 1}
      exchangeName: {in: ["Pancake", "Pancake v2"]}
      baseCurrency: {is: "`+filteredAddresses+`"}
      quoteCurrency: {is: "`+tokenAddress+`"}
    ) {
      block {
        height
        timestamp {
          unixtime
        }
      }
      baseCurrency {
        decimals
        symbol
      }
      quotePrice
    }
  }
}
    `;

    const url = "https://graphql.bitquery.io/";
    const opts = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
          "X-API-KEY": "BQYJa5pEGcQHG1mupaWJeX4IjahiI8z8"
          //"address": filteredAddresses
        },
        body: JSON.stringify({
            query
        })
    };

    var res = await fetch(url, opts)
        .then(res => res.json())
        .catch(console.error);

        console.log(res)
    var tokenPrice = (res.data.ethereum.price["0"].quotePrice).toFixed(20)
    return tokenPrice;

}
async function GetData(filteredAddresses, pairAddress, decimal, startTime, tokenPrice, priceBNB, APIpullTotal, APIdisplayed, ignore)
{
 const query = `
  {
    ethereum(network: bsc) {
      transfers(
        currency: {is: "`+filteredAddresses+`"}
        options: {asc: ["block.height"], offset: 0, limit: `+APIpullTotal+`}
      ) {
        transaction {
          hash
        }
        block {
          timestamp {
            time(format: "%Y-%m-%d %H:%M:%S")
            unixtime
          }
          height
        }
        amount
        receiver {
          uniq: address
          smartContract {
            contractType
          }
        }
      }
    }
  }
    `;

    const url = "https://graphql.bitquery.io/";
    const opts = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
          "X-API-KEY": "BQYJa5pEGcQHG1mupaWJeX4IjahiI8z8"
          //"address": filteredAddresses
        },
        body: JSON.stringify({
            query
        })
    };

    var res = await fetch(url, opts)
        .then(res => res.json())
        .catch(console.error);

      console.log(res)
      var totalDisplay;
      if (Object.values(res.data.ethereum.transfers).length < APIdisplayed)
        totalDisplay = Object.values(res.data.ethereum.transfers).length;
      else
        totalDisplay = APIdisplayed;

      var tempTokenMatches = [];
      var tempTokenTimes = [];
      var tempTokenOrder = [];
      var tempTokenAmount = [];

      for(var i = 0; i < totalDisplay; i++) {

        //console.log(res.data.ethereum.transfers[i].receiver.smartContract.contractType, i)
        if (res.data.ethereum.transfers[i].receiver.smartContract.contractType == undefined)
          {
            var tempAdd = res.data.ethereum.transfers[i].receiver.uniq
            if (!tempTokenMatches.includes(tempAdd) && !ignore.includes(tempAdd))
              {
                tempTokenMatches.push(tempAdd)
                tempTokenTimes.push(res.data.ethereum.transfers[i].block.timestamp.unixtime)
                tempTokenOrder.push(i)
                tempTokenAmount.push(res.data.ethereum.transfers[i].amount)
              }
          }
      }

      //console.log(tempTokenMatches)
      //console.log(tempTokenTimes)
      //console.log(tempTokenOrder)
      //console.log(tempTokenAmount)

      var scanTotal = tempTokenMatches.length;

      console.timeEnd("Finished Block Fetch");
      Progress("Fetching Master List...");

      const masterlistfull = await fetch("https://raw.githubusercontent.com/gabethomco/Masterlist/main/masterlistfull.json").then(masterlistfull => masterlistfull.json());

      var sings = [];
      var dupes = [];
      var trips = [];
      var quads = [];
      var quints = [];
      var extra = []

      for(let value of Object.values(masterlistfull)){
        for(let matchMaker of Object.values(value)){
          if (matchMaker != "")
            if(quints.includes(matchMaker))
              extra.push(matchMaker);
              //console.log("based alert: " +matchMaker)
            else if(quads.includes(matchMaker))
              quints.push(matchMaker);
            else if(trips.includes(matchMaker))
              quads.push(matchMaker);
            else if(dupes.includes(matchMaker))
              trips.push(matchMaker);
             else if(sings.includes(matchMaker))
              dupes.push(matchMaker)
            else
              sings.push(matchMaker);
        }
      }
      //console.log(sings);
      //console.log(dupes.length);
      //console.log(trips);
      //console.log(quads);
      //console.log(quints);

      var tokenMatches = [];
      var tokenTimes = [];
      var tokenOrder = [];
      var tokenAmount = [];

      for(var i = 0; i < scanTotal; i++) {

          if (dupes.includes(tempTokenMatches[i]))
            {
              tokenMatches.push(tempTokenMatches[i])
              tokenTimes.push(tempTokenTimes[i])
              tokenOrder.push(tempTokenOrder[i])
              tokenAmount.push(tempTokenAmount[i])
            }
      }

    GenerateTable(tokenMatches, tokenTimes, tokenOrder, tokenAmount, scanTotal, filteredAddresses, tokenPrice, priceBNB,masterlistfull, pairAddress, decimal, startTime, ignore, dupes);
    //Friends(tokenMatches, masterlistfull, ignore, dupes);
}

async function GenerateTable(tokenMatches, tokenTimes, tokenOrder, tokenAmount, scanTotal, filteredAddresses, tokenPrice, priceBNB, masterlistfull, pairAddress, decimal, startTime, ignore, dupes){

  const thisAddress = document.querySelector("#spanFromAdd").innerHTML;

  //var myDate = new Date(earliestDate *1000);
  //var startTime = epochMatch[0];
  Progress("Finding Project Matches...")

  var projectMatches = RelatedProjects(tokenMatches, masterlistfull);

  Progress("Generating Table...")

  var headers = ['#', 'wallet', 'after', 'date', 'bal', 'team', '$'];

  var myTableDiv = document.querySelector("#ContentPlaceHolder1_maintable > div:nth-child(6)");
  var table = document.createElement('TABLE');

  table.style.borderCollapse = 'separate';
  table.style.borderSpacing = '4px';
  //table.style.textAlign = 'center';
  table.style.overflowX = 'scroll';
  table.width = '100%';
  var caption = table.createCaption();
  caption.style.whiteSpace =  'normal';
  caption.style.overflowX = 'auto';
  table.id = "table1";

  caption.innerHTML = tokenMatches.length + " matches of  " + scanTotal  + " addresses scanned. " + "TOKEN: " + filteredAddresses + " PAIR: " + pairAddress;
  //console.log(matchHoldings);
  var APIkey;

  for(var i = 0; i < tokenMatches.length; i++) {
    if (i % 15) await new Promise(r => setTimeout(r, 12));
      var row = table.insertRow(i);
      row.insertCell(0).innerHTML = tokenOrder[i];
      if  (tokenMatches[i] == thisAddress)
      row.insertCell(1).innerHTML = thisAddress.slice(0,5);
        else
      row.insertCell(1).innerHTML = '<a href="https://bscscan.com/address/' + tokenMatches[i] +'">' + tokenMatches[i].slice(0,5) + '..' +'</a>';
      //row.insertCell(1).innerHTML = new Date((epoc
      //hMatch[i]- firstTransaction)*1000).toLocaleTimeString('de-DE', {timeZone: 'UTC'});
      var time = tokenTimes[i]- startTime
      row.insertCell(2).innerHTML = Timer(time);
      var date = new Date(tokenTimes[i] *1000).toUTCString();
      row.insertCell(3).innerHTML = date.slice(17,26);//date.slice(8,11) + "-" + date.slice(5,7) + "-" + date.slice(14,16) + " " + date.slice(17,26);
      row.insertCell(4).innerHTML = await MatchHold(tokenMatches, filteredAddresses, decimal, tokenPrice, tokenAmount[i]);
      row.insertCell(5).innerHTML = projectMatches[i].slice(0,4);
      //row.insertCell(6).innerHTML = orderNumber[i];
      row.insertCell(6).innerHTML = '<a href="https://bscscan.com/token/' + filteredAddresses +'?a='+tokenMatches[i]+'">$</a>';

      row.id = i;
      row.className = tokenMatches[i];
      //row.p.className = i;

        Progress("Generating table " + i + "/" + tokenMatches.length)

  }

       $(table).click(function(event) {
        event.stopPropagation();
        var $target = $(event.target);

        if ( $target.closest("td").attr("colspain")) {
            console.log("clicked: "+$target);
            $target.remove();
        } else {
          //console.log($target.closest("tr").attr('class'));
          var target = $target.closest("tr");
          var token = target.attr('class');

          if ($('.'+token).attr('id') != null)
            var row = $('.'+token).attr('id');
          else return;
          //console.log(projectMatches)
          Transactions(filteredAddresses, tokenMatches, projectMatches, decimal, row, tokenPrice, priceBNB,target);
          $('.'+token).removeAttr('id');

        }
       });

    var header = table.createTHead();
    var headerRow = header.insertRow(0);
    for(var i = 0; i < headers.length; i++) {
        headerRow.insertCell(i).innerHTML = headers[i];
     }

    document.querySelector(".loader").style.display = "none"
    $('.log').remove();

    $(table).each(function(){$(this).find('tr:odd').css('background-color','#F9FAFD')});

    $(table).each(function(){$(this).find('th').css('outline', '1px dashed LightGray')});
    myTableDiv.append(table);
    console.timeEnd("Finished Table")

        //$("#ContentPlaceHolder1_divTimeStamp > div > div.col-md-9")
          $("#table1")
          .before('<input type="button" value="EXPAND" id="ER" >')
        //$("#ER").css("position", "fixed").css("top", 1).css("left", 100);
        $("#ER").css("position", "static").css("bottom", 5).css("right", 10);
        //$("#ER").css("border-radius", "15px")
        $("#ER").css("margin", "5px");
        //$("#ER").css("height", "40");
        $("#ER").css("width", "100px");
        $("#ER").css("color", "DodgerBlue");
        $("#ER").css("background", "white");
        $("#ER").css("border-color", "DodgerBlue");
        $("#ER").click(function(){
            ExpandRows(filteredAddresses, tokenMatches, projectMatches, decimal, row, tokenPrice, priceBNB)
        });

    Friends(tokenMatches, masterlistfull, tokenOrder, decimal, tokenPrice, priceBNB, ignore, dupes);

};


function RelatedProjects(tokenMatches, masterlistfull){
  let tempArr1 = [];

  let evergrow = ["TITANO", "LIBERO", "SAFUU", "CYLUM", "OCTO", "SAFEJET", "EVERGROW", "CORSAC", "CRYPTER", "Y-5", "GALAXY"];
  let sesta = ["TIME", "SPELL", "POPSICLE", "MIM", "MAGIC", "POOCH", "FROGNATION"];
  let bonfire = ["SATURNA", "BONFIRE", "HAPPY", "CHAD", "PHOENIX", "SAKURA", "PUPPYDOGE", "DINGER"];
  let jade = ["JADE", "SMRT", "SMRTr", "BOOST", "ROCKET"];
  let drip = ["DRIP", "DOG", "PIG"];
  let guardian = ["GUARDIAN", "WOLFIE", "KNIGHT"];

  for (let i in tokenMatches){
    var tempArr2=[];
    var tempArr3=[];

    for(let value of Object.values(masterlistfull)){
      for(let matchMaker of Object.values(value)){
        if (matchMaker == tokenMatches[i])
        {

          var key = Object.keys(value).filter(k=>value[k]===tokenMatches[i]);
          tempArr2.push(" "+key)
          var keyClean = JSON.stringify(key).replace(/[\W_]+/g,"");

           if (evergrow.includes(keyClean))
            tempArr3.push("EVERGROW8")
          else if (sesta.includes(keyClean))
            tempArr3.push("SESTA   8")
          else if (bonfire.includes(keyClean))
            tempArr3.push("BONFIRE 8")
          else if (jade.includes(keyClean))
            tempArr3.push("JADE    8")
          else if (drip.includes(keyClean))
            tempArr3.push("DRIP    8")
          else if (guardian.includes(keyClean))
            tempArr3.push("GUARDIAN8")
        }
      }
    }
    var match;
    let freq = 0;
      var n = tempArr3.length;
        for(let i=0;i<n;i++){
          let count = 0;
          for(let j=i+1;j<n;j++){
              if(JSON.stringify(tempArr3[j]) === JSON.stringify(tempArr3[i])){
                  count++;
              }
          }
          if(count>=freq){
              match = tempArr3[i];
              freq = count;
          }
      }
    //console.log("match: " + match);

    tempArr1.push(match + tempArr2.join());
    //console.log(tempArr1);

  }
  return tempArr1;
};

async function MatchTimes(tokenMatches, scanTime, scanDirty)
{
  let tempArray = [];
    for (var x in tokenMatches)
        {
          tempArray.push(scanTime[scanDirty.indexOf(tokenMatches[x])]);
          //console.log("unclean: " + scanDirty.indexOf(tokenMatches[x]));

        }
  //console.log(tempArray)
  return tempArray;
}

function Timer(temp)
{

  var timer;
  //console.log(temp);
  var delta = temp;
  var time = temp;
  if (temp < 0)
    {
          delta *= -1;
          time *= -1;
    }

    var days = Math.floor(time / 86400);
    time -= days * 86400;
    var hours = Math.floor(time / 3600) % 24;
    time -= hours * 3600;
    var minutes = Math.floor(time / 60) % 60;
    time -= minutes * 60;
    var seconds = time % 60;
    //console.log('Days:', days, 'Hours:', hours, 'Minutes:', minutes, 'Seconds:', seconds)
      if  (delta > 86400)
        timer = days + "d" + hours + "h";
      else if (delta > 3600)
        timer = hours + "h" + minutes + "m";
      else if (delta > 60)
        timer = minutes + "m" + seconds + "s";
      else if (delta <= 60)
        timer = seconds + "s";

    if (temp < 0)
      return "-" + timer;
   else
    return timer;
}

async function MatchHold(tokenMatches, filteredAddresses, decimal, tokenPrice, preBalance, APIKey)
{
   decimal = 1 + '0'.repeat(decimal);
    var balance
   if (preBalance == null)
     {
       var tempBalance = await fetch("https://api.bscscan.com/api?module=account&action=tokenbalance&contractaddress=" + filteredAddresses +
      "&address=" + tokenMatches +
      "&tag=latest&apikey=" + APIKey).then(tempBalance => tempBalance.json());

       if (tempBalance.result != 0)
       {
         var temp = (tempBalance.result / decimal).toFixed(20)
         var bal = (Math.trunc(temp) * tokenPrice);
         return "$"+bal.toLocaleString('en-US', {maximumFractionDigits:0});
       }
       else
        return "$0"
     }
   else
   {
    if (preBalance != 0)
   {
     var temp = (preBalance).toFixed(20);
     var bal = (Math.trunc(temp) * tokenPrice);
     return "$"+bal.toLocaleString('en-US', {maximumFractionDigits:0});
   }
   else
     return "$0"
   }
};

async function Transactions(filteredAddresses, tokenMatches, projectMatches, decimal, row, tokenPrice, priceBNB, target)
{
  //var newRow = $('<tr><td></td><td></td><td>' + "🕐" + '</td></tr>');

  var newRow = $('<tr class="newRow"><td>'+"↪"+
                 '</td><td>'+ projectMatches[row].slice(9) +
                 '</td><td ID="in'+ row + '">' + "+ 🕐" +
                 '</td><td ID="out'+ row + '">' + "- 🕐" +
                 '</td><td>' + "￬ " + await MatchHold(tokenMatches[row], filteredAddresses, decimal, tokenPrice, null, await Key(row)) +
                 '</td><td>' + "⎆ $" + await BNBbalance(tokenMatches[row], decimal, priceBNB, await Key(row)) +
                 '</td><td>' + '<a href="https://bscscan.com/myaddress?cmd=addnew&a=' + tokenMatches +'#add">#</a>' +
                 '</td></tr>');
 if (row%2 == 0)
    newRow.css('background-color','#F9FAFD');

  if (target !=null)
    target.after(newRow);
  else
    $('#'+row).after(newRow);

    const query = `
{
  ethereum(network: bsc) {
    address(address: {is: "`+tokenMatches[row]+`"}) {
      balances(currency: {is: "`+filteredAddresses+`"}) {
        currency {
          address
          symbol
          tokenType
        }
        history {
          transferAmount
          timestamp
          value
          block
        }
      }
    }
    outbound: coinpath(
      initialAddress: {is: "`+tokenMatches[row]+`"}
      currency: {is: "`+filteredAddresses+`"}
      options: {direction: outbound}
    ) {
       amount

    }
    inbound: coinpath(
      initialAddress: {is: "`+tokenMatches[row]+`"}
      currency: {is: "`+filteredAddresses+`"}
      options: {direction: inbound}
    ) {
       amount

    }
    coinpath(
      initialAddress: {is: "`+tokenMatches[row]+`"}
      options: {desc: "count"}
    ) {
      count
      receiver {
        uniq: address
        smartContract {
          contractType
        }
      }
    }
  }
}
    `;

    const url = "https://graphql.bitquery.io/";
    const opts = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
          "X-API-KEY": "BQYJa5pEGcQHG1mupaWJeX4IjahiI8z8"
          //"address": filteredAddresses
        },
        body: JSON.stringify({
            query
        })
    };

    var res = await fetch(url, opts)
      .then(res => res.json())
      .catch(console.error);
      //console.log(res)

      var totalOut = res.data.ethereum.outbound["0"].amount;
      var totalIn = res.data.ethereum.inbound["0"].amount;

      var tempOut = (totalOut / decimal).toFixed(20);
      var balOut = (Math.trunc(tempOut) * tokenPrice);
      var balanceOut = "$"+balOut.toLocaleString('en-US', {maximumFractionDigits:0});

      var tempIn = (totalIn / decimal).toFixed(20);
      var balIn = (Math.trunc(tempIn) * tokenPrice);
      var balanceIn = "$"+balIn.toLocaleString('en-US', {maximumFractionDigits:0});

      $("#in" + row).text("⤥ " + balanceIn)
      $("#out" + row).text("⤤ " + balanceOut)


      var interactedAddress = [];
      for(var i = 0; i < res.data.ethereum.coinpath.length; i++) {
        //console.log(res.data.ethereum.coinpath[i].count)
        if (res.data.ethereum.coinpath[i].receiver.smartContract.contractType == null)
          {
            interactedAddress.push(res.data.ethereum.coinpath[i].receiver.uniq);
              //console.log(tempAdd);
          }
      }
      //console.log(interactedAddress[0]);

}

async function ExpandRows(filteredAddresses, tokenMatches, projectMatches, decimal, row, tokenPrice, priceBNB)
{
        var table = document.getElementById('table1');
        var rowLength = tokenMatches.length;
       // console.log(rowLength);
        $('#ER').remove();
        //$('#ER').disable();
        $(table).off('click');

         for(var i=1; i<(rowLength *2); i++){
          //if (i % 12) await new Promise(r => setTimeout(r, 500));

            var row = table.rows[i];
            var rowID = row.id;
            if (rowID != "")
              {
                 Transactions(filteredAddresses, tokenMatches, projectMatches, decimal, rowID, tokenPrice, priceBNB)
                await new Promise(r => setTimeout(r, 500));
                i++;

              }
            /*var cellLength = row.cells.length;
            for(var y=0; y<cellLength; y+=1){
              var cell = row.cells[y];
            }
             */
        }
}

async function Friends(tokenMatches, masterlistfull, tokenOrder, decimal, tokenPrice, priceBNB, ignore, twos)
{
  var interactedRow = $('<tr class="newRow"><td>'+"#"+
   '</td><td ID="progress">' + "1 of " + tokenMatches.length + "" +
   '</td><td ID="progress2">' + "" +
   '</td><td ID="progress3">' + "" +
   '</td><td ID="progress4">' + "" +
   '</td><td ID="progress5">' + "" +
   '</td><td ID="progress6">' + "" +
   '</td></tr>');
   //if (row%2 == 0)
   // interactedRow.css('background-color','#F9FAFD');
    $("#" + (tokenMatches.length - 1)).closest("tr").after(interactedRow);

    interactedRow.css('outline', '1px dashed LightGray');
    interactedRow.css('background-color','#F9FAFD');

  var interactedAddress = [];

  var j = 1;
  var broked = 0;

  for await (let match of tokenMatches) {
      //console.log(tokenMatches)
      //console.log(match)
    const query = `
      {
        ethereum(network: bsc) {
          coinpath(
            initialAddress: {is: "`+match+`"}
            options: {desc: "count"}
          ) {
            count
            receiver {
              uniq: address
              smartContract {
                contractType
              }
            }
          }
        }
      }
      `;

    const url = "https://graphql.bitquery.io/";
    const opts = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
          "X-API-KEY": "BQYJa5pEGcQHG1mupaWJeX4IjahiI8z8"
          //"address": filteredAddresses
        },
        body: JSON.stringify({
            query
        })
    };

    var res = await fetch(url, opts)
      .then(res => res.json())
      .catch(console.error);
    //console.log(match, res.data.ethereum.coinpath)
    if (res.data.ethereum.coinpath !== null)
    {
      for(var i = 0; i < res.data.ethereum.coinpath.length; i++)
      {
        var temp = res.data.ethereum.coinpath[i].receiver.uniq;
        if ((res.data.ethereum.coinpath[i].receiver.smartContract.contractType == null) && !ignore.includes(temp))
        {
         interactedAddress.push(temp);
        }
       }
    }
    else
      {
        broked = broked + 1;
        $("#progress2").text(broked + " F")
      }

    if (j == tokenMatches.length)
    {
      $("#progress").text("Frens: ")
      $("#progress1").text("")
      //$("#progress2").text("")
      $("#progress3").text("last")
      $("#progress4").text("bnb")
      $("#progress5").text("team")
      $("#progress6").text("#")
    }
    else
      $("#progress").text(j + " of " + tokenMatches.length + "")

    j++;
  }

  var sings = [];
  var dupes = [];
  var trips = [];
  var quads = [];
  var quints = [];
  var extra = [];


  for(var i = 0; i < interactedAddress.length; i++) {
    if (interactedAddress[i] != "")
      if(quints.includes(interactedAddress[i]))
        extra.push(interactedAddress[i]);
      else if(quads.includes(interactedAddress[i]))
        quints.push(interactedAddress[i]);
      else if(trips.includes(interactedAddress[i]))
        quads.push(interactedAddress[i]);
      else if(dupes.includes(interactedAddress[i]))
        trips.push(interactedAddress[i]);
      else if(sings.includes(interactedAddress[i]))
        dupes.push(interactedAddress[i])

      else
        sings.push(interactedAddress[i]);
  }

  //console.log(sings);
  //console.log("dupes: "+dupes.length);
  //console.log(dupes);
  //console.log(trips);
  //console.log(quads);
  //console.log(quints);

  var projectMatches = RelatedProjects(dupes, masterlistfull);

  var j = 0;
  for(var i = 0; i < twos.length; i++) {
    if (twos.includes(dupes[i]))
      {
        if (tokenMatches.includes(dupes[i]))
          {
            var index = tokenMatches.indexOf(dupes[i])
            var interactedRow = $('<tr class="newRow"><td>'+ tokenOrder[index] +
           '</td><td>'+ '<a href="https://bscscan.com/address/' + dupes[i] +'">' + dupes[i].slice(0,5) + '..' +'</a>' +
           '</td><td colspan="2">'+ "" + await projectMatches[i].slice(9) +
           //'</td><td>'+ "Last Active" +
           '</td><td>' + "⎆ $" + await BNBbalance(dupes[i], decimal, priceBNB, await Key(i)) +
           '</td><td>'+  "" + await projectMatches[i].slice(0,4) +
           '</td><td>' + '<a href="https://bscscan.com/myaddress?cmd=addnew&a=' + dupes[i] +'#add">#</a>' +
           '</td></tr>');
          }
        else
          {
            var interactedRow = $('<tr class="newRow"><td>'+""+
           '</td><td>'+ '<a href="https://bscscan.com/address/' + dupes[i] +'">' + dupes[i].slice(0,5) + '..' +'</a>' +
           '</td><td colspan="2">'+ "" + await projectMatches[i].slice(9) +
           //'</td><td>'+ "Last Active" +
           '</td><td>' + "⎆ $" + await BNBbalance(dupes[i], decimal, priceBNB, await Key(i)) +
           '</td><td>'+  "" + await projectMatches[i].slice(0,4) +
           '</td><td>' + '<a href="https://bscscan.com/myaddress?cmd=addnew&a=' + dupes[i] +'#add">#</a>' +
           '</td></tr>');
          }
        $("#progress").closest("tr").after(interactedRow);

        if (j%2 == 0)
        interactedRow.css('background-color','#F9FAFD');

        j++;
      }
    }
      $(".newRow").css('outline', 'none');
      $(".newRow").css('background-color','white');
  if (j == 0)
    {
      $("#progress").text("0 frens")
      $("#progress1").text("")
     // $("#progress2").text("")
      $("#progress3").text("")
      $("#progress4").text("")
      $("#progress5").text("")
      $("#progress6").text("")
      //$(".newRow").remove();
    }
}

async function BNBbalance(tokenMatches, decimal, priceBNB, APIKey)
{
  var tempBalance = await fetch("https://api.bscscan.com/api?module=account&action=balance&address=" + tokenMatches +
  "&apikey=" + APIKey).then(tempBalance => tempBalance.json());
  //console.log(tempBalance)
  var bal = ((tempBalance.result / 1000000000000000000).toFixed(20) * priceBNB)
  return bal.toLocaleString('en-US', {maximumFractionDigits:0});

};

async function Key(i)
{
  var APIKey0;

  if (i % 3 == 0)
    APIKey0 = '4MZSGAQDPPK71GU6KK7ZTXDCPXN35V66EUU';
  else if (i % 3 == 1)
    APIKey0 = 'JJX3A2I7X6HXX1WP2MX8C319GV64B1WIVH';
  else if (i % 3 == 2)
    APIKey0 = 'BFBITW7576V32VJ134HK8VGFWPZDFRVTP1';
  return APIKey0;
}

async function Spreadsheet()
{

}

function TransactionType()
{
  console.time("Finished First Fetch");
  console.time("Finished Block Fetch");
  console.time("Finished Table");

  if (document.querySelector("#inputdata").innerHTML.indexOf("contribute") != -1) {
    Contribute();

    console.log("TOKEN ADDRESS: " + filteredAddresses);
    console.log("PAIR ADDRESS: " + pairAddress);
    console.timeEnd("Finished First Fetch");
    Progress("Finding Block Fetch...");
    return true;
  }
};

function Contribute()
{
  const pink = document.querySelector("#contractCopy").innerHTML;

  var pinksale = document.createElement("iframe");
          pinksale.setAttribute("src", "https://www.pinksale.finance/launchpad/" + pink + "?chain=BSC");
          pinksale.setAttribute("sandbox", "allow-same-origin allow-scripts allow-forms");
          pinksale.style.width = "100%";
          pinksale.style.height = "800px";
          document.querySelector("#ContentPlaceHolder1_maintable > div:nth-child(6) > div.col-md-9").before(pinksale);
          document.querySelector('#ContentPlaceHolder1_maintable > div:nth-child(6) > div.col-md-3.font-weight-bold.font-weight-sm-normal.mb-1.mb-md-0').remove();

        throw new Error();

};

function Loading(loader)
{
  loader.className = "loader";
  const emoji = document.createElement("div");
  loader.appendChild(emoji);
  document.querySelector("#ContentPlaceHolder1_maintable > div:nth-child(6)  > div.col-md-3.font-weight-bold.font-weight-sm-normal.mb-1.mb-md-0").after(loader);
  loader.style.border = '1px';
  document.querySelector('#ContentPlaceHolder1_maintable > div:nth-child(6) > div.col-md-3.font-weight-bold.font-weight-sm-normal.mb-1.mb-md-0').remove();
  document.querySelector('#ContentPlaceHolder1_li_disqus').remove();

  const logger = document.createElement("div");
  loader.after(logger);
  logger.className = 'logger';
  const log = document.createElement("div");
  logger.appendChild(log);
  log.className = 'log';

  logger.style.paddingLeft = '10px';
  loader.style.padding = '5px';

  const emojis = ["🕐", "🕜", "🕑","🕝", "🕒", "🕞", "🕓", "🕟", "🕔", "🕠", "🕕", "🕡", "🕖", "🕢",  "🕗", "🕣", "🕘", "🕤", "🕙",  "🕥", "🕚", "🕦",  "🕛", "🕧"];
  const interval = 100;

  const loadEmojis = (arr) => {
      setInterval(() => {
        //emoji.width = "50%";
        emoji.innerText = arr[Math.floor(Math.random() * arr.length)];
      }, interval);
  }
  const init = () => {
    loadEmojis(emojis);
  }
  init();
}

function Progress(output)
{
  $('.log').remove();
  const log = document.createElement("div");
  $('.logger').append(log);
  log.className = "log";
  log.innerText = output;
//var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
}

function Purchase(addresses, itemNumber){

    $("#logoAndNav > nav > div.w-lg-auto").append('<input type="button" value="BUY" id="BB" >')
    //$("#BT").css("position", "fixed").css("top", 1).css("left", 100);
    $("#BB").css("position", "fixed").css("top", 1).css("right", 60);
    //$("#NB").css("border-radius", "15px")
    $("#BB").css("margin", "5px");
    $("#BB").css("width", "130px");
    $("#BB").css("height", "40px");

    $("#BB").css("color", "white");
    $("#BB").css("background", "DodgerBlue");
    $("#BB").css("border-color", "white");
    $("#BB").click(function(){
        window.open('https://metamask.app.link/dapp/pancakeswap.finance/swap?chain=bsc&outputCurrency=' + addresses[itemNumber]);
    });
};

function PurchaseNext(addresses, itemNumber){
    $("#BB").click(function(){
        window.open('https://metamask.app.link/dapp/pancakeswap.finance/swap?chain=bsc&outputCurrency=' + addresses[itemNumber]);
    });
};
