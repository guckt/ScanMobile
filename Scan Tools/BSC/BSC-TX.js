// ==UserScript==
// @name         MOBILE/BSC/TX
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

    var APIkey1 = '4MZSGAQDPPK71GU6KK7ZTXDCPXN35V66EUU';
    var APIkey2 = 'JJX3A2I7X6HXX1WP2MX8C319GV64B1WIVH';
    var APIkey3 = 'BFBITW7576V32VJ134HK8VGFWPZDFRVTP1';


    var APIpullTotal = 5000;
    var APIdisplayed = 1000;

    let filteredAddresses = [];
    var pairAddress = "";

    var address = [];

    var decimal;

    //var projectMatches = [];
    //var matchHoldings = [];

    var ignore =['0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c', //WBNB
                 '0xe9e7cea3dedca5984780bafc599bd69add087d56', //BUSD
                 '0x2170ed0880ac9a755fd29b2688956bd959f933f8', //B-ETH
                 '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d', //B-USDC
                 '0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3', //B-DAI
                 '0x3ee2200efb3400fabb9aacf31297cbdd1d435d47', //B-ADA
                 '0x55d398326f99059ff775485246999027b3197955', //B-BUSD
                 '0x10ed43c718714eb63d5aa57b78b54704e256024e']; //Pancakeswap LP

    var contract = false;

    const loader = document.createElement("div");

    if (TransactionType())
    return;

    Loading(loader);
    // FILTERING
    const topFilter = document.querySelector("#content > div.container.py-3.mn-b3 > div").remove();
    const bannerFilter = document.querySelector("#content > div:nth-child(10)").remove();
    const sponsorFilter = document.querySelector("#ContentPlaceHolder1_maintable > div:nth-child(8) > div.col-md-9 > div").remove();
    //const sponsorFilter2 = document.querySelector("#ContentPlaceHolder1_maintable > div:nth-child(8) > div").remove();
    const commentsFilter = document.querySelector("#ContentPlaceHolder1_li_disqus").remove();


    for (let i = 1; i < 20; i++) {
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

    Chart(filteredAddresses, itemNumber);
    Purchase(filteredAddresses, itemNumber);

    if (filteredAddresses.length > 1) {
        $("#ContentPlaceHolder1_maintable > div:nth-child(14) > div.col-md-9").append('<input type="button" value="NEXT" id="NB" >')
        //$("#BT").css("position", "fixed").css("top", 1).css("left", 100);
        $("#NB").css("position", "absolute").css("bottom", 2).css("right", 5);
        //$("#NB").css("border-radius", "15px")
        $("#NB").css("margin", "5px");
        $("#NB").css("width", "100px");
        $("#NB").css("color", "white");
        $("#NB").css("background", "DodgerBlue");
        $("#NB").css("border-color", "white");
        $("#NB").click(function(){
            itemNumber = itemNumber + 1;
            itemNumber = itemNumber % filteredAddresses.length;
            Chart(filteredAddresses, itemNumber);
            PurchaseNext(filteredAddresses, itemNumber);
        });
    }
function Chart(addresses, itemNumber){

        if (filteredAddresses.length != 0) {
            var chart = document.createElement("iframe");
            chart.setAttribute("src", "https://dexscreener.com/bsc/" + filteredAddresses[itemNumber]);
            chart.style.width = "100%";
            chart.style.height = "800px";

            if (document.querySelector("#ContentPlaceHolder1_maintable > iframe")){
                document.querySelector("#ContentPlaceHolder1_maintable > iframe").replaceWith(chart);
            }
            else {
                document.querySelector("#ContentPlaceHolder1_maintable > hr:nth-child(15)").before(chart);
            }
        }
      Progress("Finished HUD...");
    }

GetPair(APIkey1, filteredAddresses[itemNumber], pairAddress, Matching, contract);


function Matching(pairAddress)
  {
    Promise.all([
      // Get normal transactions for token address
      //fetch("https://api.bscscan.com/api?module=account&action=txlist&address=" + filteredAddresses[itemNumber] +
      //    "&startblock=0&endblock=99999999&page=1&offset=" + APIpullTotal +
      //   "&sort=asc&apikey=" + APIkey1).then(scan => scan.json()),

      // Get BEP20 transactions for pair address
      fetch("https://api.bscscan.com/api?module=account&action=tokentx&address=" + pairAddress +
        "&startblock=0&endblock=99999999&page=1&offset=" + APIpullTotal +
        "&sort=asc&apikey=" + APIkey1).then(scan => scan.json()),
      fetch("https://raw.githubusercontent.com/gabethomco/Masterlist/main/masterlist.json").then(masterlist => masterlist.json()),
      fetch("https://raw.githubusercontent.com/gabethomco/Masterlist/main/masterlistfull.json").then(masterlistfull => masterlistfull.json()),
      fetch("https://api.bscscan.com/api?module=contract&action=getsourcecode&address=" + filteredAddresses[itemNumber] +
          "&apikey=" + APIkey1).then(contract => contract.json())
      ]).then(([scan, masterlist, masterlistfull, contract]) => {
        
      console.timeEnd("Finished Block Fetch");
      Progress("Finished Block Fetch...");

      var dec = document.documentElement.innerHTML.substring(document.documentElement.innerHTML.indexOf('decimals')).slice(10,12);
      console.log("DECIMALS: " + dec);
      decimal = 1 + '0'.repeat(dec);

     var scanDirty = scan.result.map(function(item)
      {
          return item.from;
      });

      var scanTime = scan.result.map(function(item)
      {
          return item.timeStamp;
      });

      var removeUndefined = scanDirty.filter(item => { return item !== undefined });
      var removeDuplicates = [...new Set(removeUndefined)]
      let scanClean = removeDuplicates.filter(function (item) {
          return item.indexOf("s") !== 0;
      });
            //console.table(scanClean);


      var scanMapped = scanClean.slice(0, APIdisplayed);
      var scanTotal = scanMapped.length;

      var masterMapped = masterlist.map(function(item)
      {
          return item.token;
      });

    const unfilteredMatches = scanMapped.filter(element => masterMapped.includes(element));

    GenerateTable(unfilteredMatches, scanTotal, filteredAddresses, scanTime, masterlistfull, pairAddress, scanDirty, decimal, APIkey2, APIkey3);

    }).catch((err) => {
      console.log(err);
    });
  }
});

async function GetPair(APIkey1, filteredAddresses, pairAddress, Matching, contract)
{
      var contrived;
      contrived = await fetch("https://api.bscscan.com/api?module=account&action=tokentx&address=" + filteredAddresses +
          "&startblock=0&endblock=99999999&page=1&offset=" + 30 +
          "&sort=asc&apikey=" + APIkey1).then(contrived => contrived.json())
          console.table(contrived.result);

        if((!Object.keys(contrived.result).length) || (contract)){
          console.log("no data found");

          contrived = await fetch("https://api.bscscan.com/api?module=account&action=tokentx&contractaddress=" + filteredAddresses +
          "&startblock=0&endblock=99999999&page=1&offset=" + 30 +
          "&sort=asc&apikey=" + APIkey1).then(contrived => contrived.json())
          contract = false;

        }

      var contrivedScan = contrived.result.map(function(item)
      {
          return item.from;
      });

      let freq = 0;
      var n = contrivedScan.length;
        for(let i=0;i<n;i++){
          let count = 0;
          for(let j=i+1;j<n;j++){
              if(JSON.stringify(contrivedScan[j]) === JSON.stringify(contrivedScan[i])){
                  count++;
              }
          }
          if(count>=freq){
              pairAddress = contrivedScan[i];
              freq = count;
          }
      }
      console.log("pair address: " + pairAddress);
      console.timeEnd("Finished First Fetch");
      //Progress("Finished First Fetch...");


      if ((pairAddress == filteredAddresses)||(pairAddress == '0x0000000000000000000000000000000000000000'))
        {
          contract = true;
          console.log("fuck");
          GetPair(APIkey1, filteredAddresses, pairAddress, Matching, contract);
        }
    
          Progress("Finding Block Fetch...");

      if (!contract)
        Matching(pairAddress);
}

async function GenerateTable(unfilteredMatches, scanTotal, filteredAddresses, scanTime, masterlistfull, pairAddress, scanDirty, decimal, APIkey1, APIkey2, APIkey3){



  const thisAddress = document.querySelector("#spanFromAdd").innerHTML;
  //console.log(thisAddress);

  Progress("Finding First Transaction...")

  const firstTransaction = await FirstTransaction(scanDirty, scanTime, APIkey1, APIkey2, APIkey3)
    console.log(firstTransaction);

  Progress("Validating Token Matches...")

  var tokenMatches = await FilterContracts(unfilteredMatches, APIkey1, APIkey2, APIkey3)
  //console.log(tokenMatches);
  Progress("Finding Match Times...")

  var epochMatch = await MatchTimes(tokenMatches, scanTime, scanDirty)

  //var myDate = new Date(earliestDate *1000);
  //var startTime = epochMatch[0];
  Progress("Finding Project Matches...")

  var projectMatches = RelatedProjects(tokenMatches, masterlistfull);

  Progress("Generating Table...")

  var headers = ['#', 'wallet', 'after', 'date', 'bal', 'match', '$'];

  var myTableDiv = document.querySelector("#ContentPlaceHolder1_maintable > div:nth-child(8)");
  var table = document.createElement('TABLE');

  table.style.borderCollapse = 'separate';
  table.style.borderSpacing = '4px';
  //table.style.textAlign = 'center';
  table.style.overflowX = 'scroll';
  table.width = '100%';
  var caption = table.createCaption();
  caption.style.whiteSpace =  'normal';
  caption.style.overflowX = 'auto';

  caption.innerHTML = tokenMatches.length + " matches of  " + scanTotal  + " addresses scanned. " + "TOKEN: " + filteredAddresses[0] + " PAIR: " + pairAddress;
  //console.log(matchHoldings);
  var APIkey;

  for(var i = 0; i < tokenMatches.length; i++) {
    if (i % 3 == 0)
      APIkey = APIkey1;
    else if (i % 3 == 1)
      APIkey = APIkey2;
    else if (i % 3 == 2)
      APIkey = APIkey3;
    if (i % 15) await new Promise(r => setTimeout(r, 12));
      var row = table.insertRow(i);
      row.insertCell(0).innerHTML = i + 1;;
      if  (tokenMatches[i] == thisAddress)
      row.insertCell(1).innerHTML = thisAddress;
        else
      row.insertCell(1).innerHTML = '<a href="https://bscscan.com/address/' + tokenMatches[i] +'">' + tokenMatches[i] + '</a>';
      //row.insertCell(1).innerHTML = new Date((epochMatch[i]- firstTransaction)*1000).toLocaleTimeString('de-DE', {timeZone: 'UTC'});
      row.insertCell(2).innerHTML = Timer(epochMatch[i]- firstTransaction);
      var date = new Date(epochMatch[i] *1000).toUTCString();
      row.insertCell(3).innerHTML = date.slice(8,11) + "-" + date.slice(5,7) + "-" + date.slice(14,16) + " " + date.slice(17,26);
      row.insertCell(4).innerHTML = await MatchHold(tokenMatches[i], APIkey, filteredAddresses[0], decimal);
      row.insertCell(5).innerHTML = projectMatches[i];
      row.insertCell(6).innerHTML = '<a href="https://bscscan.com/token/' + filteredAddresses[0] +'?a='+tokenMatches[i]+'">$</a>';

    //if (i == tokenMatches.length)
    //{
    //}
        Progress("Generating table " + i + "/" + tokenMatches.length)

  }
    var header = table.createTHead();
    var headerRow = header.insertRow(0);
    for(var i = 0; i < headers.length; i++) {
        headerRow.insertCell(i).innerHTML = headers[i];
     }

    document.querySelector(".loader").style.display = "none"
    $('.log').remove();
    $(table).each(function(){$(this).find('tr:odd').css('background-color','#F9FAFD')});

    myTableDiv.append(table);
    console.timeEnd("Finished Table")
};

async function FilterContracts(unfilteredMatches, APIkey1, APIkey2, APIkey3)
{
  var APIkey;
  let tempArray = [];
    for(var i = 0; i < unfilteredMatches.length; i++) {
      if (i % 3 == 0)
      APIkey = APIkey1;
      else if (i % 3 == 1)
      APIkey = APIkey2;
      else if (i % 3 == 2)
      APIkey = APIkey3;
      if (i % 15) await new Promise(r => setTimeout(r, 12));
       const balance = await fetch("https://api.bscscan.com/api?module=contract&action=getcontractcreation&contractaddresses=" + unfilteredMatches[i] +
          "&apikey=" + APIkey).then(balance => balance.json());
        if (balance.result == null)
          tempArray.push(unfilteredMatches[i]);
        console.log(balance.result);
        Progress("Validating Addresses " + i + "/" + unfilteredMatches.length)

    }
  //console.table(tempArray);
  return tempArray;
};

async function FirstTransaction(scanDirty, scanTime, APIkey1, APIkey2, APIkey3)
{
  var firstTransaction = false;
  var i = 0;
  var APIkey;
  while (!firstTransaction)
    {
      console.log(scanDirty[i]);
      if (i % 3 == 0)
      APIkey = APIkey1;
     else if (i % 3 == 1)
      APIkey = APIkey2;
      else if (i % 3 == 2)
      APIkey = APIkey3;
      if (i % 15) await new Promise(r => setTimeout(r, 12));
       const balance = await fetch("https://api.bscscan.com/api?module=contract&action=getcontractcreation&contractaddresses=" + scanDirty[i] +
          "&apikey=" + APIkey).then(balance => balance.json());
        if (balance.result == null)
          {
            console.log(balance.result)
            return scanTime[i]
          }
      i++;
      if (i > 20)
        {
          Progress("Validating Addresses broked");
          return;
        }
    }
}

function RelatedProjects(tokenMatches, masterlistfull){
  let tempArr1 = [];
  for (let i in tokenMatches){
    var tempArr2=[];

    for(let value of Object.values(masterlistfull)){
      for(let matchMaker of Object.values(value)){
        if (matchMaker == tokenMatches[i])
        {
          tempArr2.push(Object.keys(value).filter(k=>value[k]===tokenMatches[i]));
        }
      }
    }
    //console.log(penile);
    tempArr1.push(tempArr2.join());
  }
  return tempArr1;
};

async function MatchTimes(tokenMatches, scanTime, scanDirty)
{
  let tempArray = [];
    for (var x in tokenMatches)
        {
          tempArray.push(scanTime[scanDirty.indexOf(tokenMatches[x])]);
        }
  return tempArray;
}

function Timer(temp)
{
  var timer;
  var delta = temp;
    var days = Math.floor(temp / 86400);
    temp -= days * 86400;
    var hours = Math.floor(temp / 3600) % 24;
    temp -= hours * 3600;
    var minutes = Math.floor(temp / 60) % 60;
    temp -= minutes * 60;
    var seconds = temp % 60;
    //console.log('Days:', days, 'Hours:', hours, 'Minutes:', minutes, 'Seconds:', seconds)
      if  (delta > 86400)
        timer = days + " day " + hours + " hr";
      else if (delta > 3600)
        timer = hours + " hr " + minutes + " min";
      else if (delta > 60)
        timer = minutes + " min " + seconds + " sec";
      else if (delta <= 60)
        timer = seconds + " seconds";

    return timer;
}

async function MatchHold(tokenMatches, APIkey, filteredAddresses, decimal)
{
   var bal;
   const balance = await fetch("https://api.bscscan.com/api?module=account&action=tokenbalance&contractaddress=" + filteredAddresses +
      "&address=" + tokenMatches +
      "&tag=latest&apikey=" + APIkey).then(balance => balance.json());
   if (balance.result != 0)
     {
       bal = balance.result ;
     }
   else
      bal = balance.result
  console.log(balance.result)
    //console.log(bal.toFixed(3));
  //bal = parseFloat(bal).toFixed(2);
  //bal.toLocaleString('en-US', {maximumFractionDigits:2});
  return bal.toLocaleString('en-US', {maximumFractionDigits:2});
};



function TransactionType()
  {
    console.time("Finished First Fetch");
    console.time("Finished Block Fetch");
    console.time("Finished Table");

    if (document.querySelector("#inputdata").innerHTML.indexOf("contribute") != -1) {
    Contribute();
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
          document.querySelector("#ContentPlaceHolder1_maintable > div:nth-child(8) > div.col-md-9").before(pinksale);
};

function Loading(loader)
{
  loader.className = "loader";
  const emoji = document.createElement("div");
  loader.appendChild(emoji);
  document.querySelector("#ContentPlaceHolder1_maintable > div:nth-child(8)  > div.col-md-3.font-weight-bold.font-weight-sm-normal.mb-1.mb-md-0").after(loader);
  loader.setAttribute("align", "center");
  document.querySelector('#ContentPlaceHolder1_maintable > div:nth-child(8) > div.col-md-3.font-weight-bold.font-weight-sm-normal.mb-1.mb-md-0').remove();

  const logger = document.createElement("div");
  loader.after(logger);
  logger.className = 'logger';
  const log = document.createElement("div");
  logger.appendChild(log);
  log.className = 'log';

  logger.style.paddingLeft = '100px';
  loader.style.padding = '6px';


  const emojis = ["????", "????", "????","????", "????", "????", "????", "????", "????", "????", "????", "????", "????", "????",  "????", "????", "????", "????", "????",  "????", "????", "????",  "????", "????"];

  const interval = 100;

  const loadEmojis = (arr) => {
      setInterval(() => {
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
