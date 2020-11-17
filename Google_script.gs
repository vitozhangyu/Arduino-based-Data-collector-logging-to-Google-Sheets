// This code shows how the Google Script takes the uploaded data from the Arduino and store it in its corresponding Google spreadsheets and make analysis and charts over the data. The corresponding sheet link is: https://docs.google.com/spreadsheets/d/1WH5DgohmEYl1PSwjiyz5xM3mm7EYOXnFjsHGCCtlg_Q/edit#gid=340263445
var id = '12q3oyBIc7wQMqvgzgUToL8AzBG_s7gFNoNxN98OeDp8'; // This is the spreadsheet ID that corresponds to this script
var spreadsheet = SpreadsheetApp.openById(id);
var sheet = SpreadsheetApp.openById(id).getActiveSheet();

function doGet(e) {  // Get the CPRdata as e from Arduino from the Https request: https://script.google.com/macros/s/AKfycbwZVNu1a-d2qICRNFSq0CgYL3DwjHHyvu9rY4PlPYy9038aIQ0/exec?CPRdata=" + CPRdata, 'AKfycbwZVNu1a-d2qICRNFSq0CgYL3DwjHHyvu9rY4PlPYy9038aIQ0‘ is the ID of this script
  Logger.log( JSON.stringify(e) ); // Make e as a string

  var result = 'Y'; 

  if (e.parameter == undefined) {
    result = 'N';
  }
  else {
    var newRow;
    for (var param in e.parameter) {
      Logger.log('In for loop, param='+param);
      var value = stripQuotes(e.parameter[param]); // stripQuotes() function eliminate potential garbled characters from e 
      switch (param) {
          case 'CPRdata': //Parameter
          var CPRdata = value.split(","); // Split value (e) by comma and assign it into CPRdata array
          break;
        default:
          result = "N";
      }
    }
    Logger.log(JSON.stringify(CPRdata));
    
    newRow = sheet.getLastRow() + 1;
    var newRange = sheet.getRange(newRow, 1, 100, 4); // Assign 400 cells (100 lines of data: date, time, ACC, rate) all in once
    newRange.setValues([[CPRdata[0],CPRdata[1],CPRdata[2],CPRdata[3]],[CPRdata[4],CPRdata[5],CPRdata[6],CPRdata[7]],[CPRdata[8],CPRdata[9],CPRdata[10],CPRdata[11]],
                        [CPRdata[12],CPRdata[13],CPRdata[14],CPRdata[15]],[CPRdata[16],CPRdata[17],CPRdata[18],CPRdata[19]],[CPRdata[20],CPRdata[21],CPRdata[22],CPRdata[23]],
                        [CPRdata[24],CPRdata[25],CPRdata[26],CPRdata[27]],[CPRdata[28],CPRdata[29],CPRdata[30],CPRdata[31]],[CPRdata[32],CPRdata[33],CPRdata[34],CPRdata[35]],
                        [CPRdata[36],CPRdata[37],CPRdata[38],CPRdata[39]],[CPRdata[40],CPRdata[41],CPRdata[42],CPRdata[43]],[CPRdata[44],CPRdata[45],CPRdata[46],CPRdata[47]],
                        [CPRdata[48],CPRdata[49],CPRdata[50],CPRdata[51]],[CPRdata[52],CPRdata[53],CPRdata[54],CPRdata[55]],[CPRdata[56],CPRdata[57],CPRdata[58],CPRdata[59]],
                        [CPRdata[60],CPRdata[61],CPRdata[62],CPRdata[63]],[CPRdata[64],CPRdata[65],CPRdata[66],CPRdata[67]],[CPRdata[68],CPRdata[69],CPRdata[70],CPRdata[71]],
                        [CPRdata[72],CPRdata[73],CPRdata[74],CPRdata[75]],[CPRdata[76],CPRdata[77],CPRdata[78],CPRdata[79]],[CPRdata[80],CPRdata[81],CPRdata[82],CPRdata[83]],
                        [CPRdata[84],CPRdata[85],CPRdata[86],CPRdata[87]],[CPRdata[88],CPRdata[89],CPRdata[90],CPRdata[91]],[CPRdata[92],CPRdata[93],CPRdata[94],CPRdata[95]],
                        [CPRdata[96],CPRdata[97],CPRdata[98],CPRdata[99]],[CPRdata[100],CPRdata[101],CPRdata[102],CPRdata[103]],[CPRdata[104],CPRdata[105],CPRdata[106],CPRdata[107]],
                        [CPRdata[108],CPRdata[109],CPRdata[110],CPRdata[111]],[CPRdata[112],CPRdata[113],CPRdata[114],CPRdata[115]],[CPRdata[116],CPRdata[117],CPRdata[118],CPRdata[119]],
                        [CPRdata[120],CPRdata[121],CPRdata[122],CPRdata[123]],[CPRdata[124],CPRdata[125],CPRdata[126],CPRdata[127]],[CPRdata[128],CPRdata[129],CPRdata[130],CPRdata[131]],
                        [CPRdata[132],CPRdata[133],CPRdata[134],CPRdata[135]],[CPRdata[136],CPRdata[137],CPRdata[138],CPRdata[139]],[CPRdata[140],CPRdata[141],CPRdata[142],CPRdata[143]],
                        [CPRdata[144],CPRdata[145],CPRdata[146],CPRdata[147]],[CPRdata[148],CPRdata[149],CPRdata[150],CPRdata[151]],[CPRdata[152],CPRdata[153],CPRdata[154],CPRdata[155]],
                        [CPRdata[156],CPRdata[157],CPRdata[158],CPRdata[159]],[CPRdata[160],CPRdata[161],CPRdata[162],CPRdata[163]],[CPRdata[164],CPRdata[165],CPRdata[166],CPRdata[167]],
                        [CPRdata[168],CPRdata[169],CPRdata[170],CPRdata[171]],[CPRdata[172],CPRdata[173],CPRdata[174],CPRdata[175]],[CPRdata[176],CPRdata[177],CPRdata[178],CPRdata[179]],
                        [CPRdata[180],CPRdata[181],CPRdata[182],CPRdata[183]],[CPRdata[184],CPRdata[185],CPRdata[186],CPRdata[187]],[CPRdata[188],CPRdata[189],CPRdata[190],CPRdata[191]],
                        [CPRdata[192],CPRdata[193],CPRdata[194],CPRdata[195]],[CPRdata[196],CPRdata[197],CPRdata[198],CPRdata[199]],[CPRdata[200],CPRdata[201],CPRdata[202],CPRdata[203]],
                        [CPRdata[204],CPRdata[205],CPRdata[206],CPRdata[207]],[CPRdata[208],CPRdata[209],CPRdata[210],CPRdata[211]],[CPRdata[212],CPRdata[213],CPRdata[214],CPRdata[215]],
                        [CPRdata[216],CPRdata[217],CPRdata[218],CPRdata[219]],[CPRdata[220],CPRdata[221],CPRdata[222],CPRdata[223]],[CPRdata[224],CPRdata[225],CPRdata[226],CPRdata[227]],
                        [CPRdata[228],CPRdata[229],CPRdata[230],CPRdata[231]],[CPRdata[232],CPRdata[233],CPRdata[234],CPRdata[235]],[CPRdata[236],CPRdata[237],CPRdata[238],CPRdata[239]],
                        [CPRdata[240],CPRdata[241],CPRdata[242],CPRdata[243]],[CPRdata[244],CPRdata[245],CPRdata[246],CPRdata[247]],[CPRdata[248],CPRdata[249],CPRdata[250],CPRdata[251]],
                        [CPRdata[252],CPRdata[253],CPRdata[254],CPRdata[255]],[CPRdata[256],CPRdata[257],CPRdata[258],CPRdata[259]],[CPRdata[260],CPRdata[261],CPRdata[262],CPRdata[263]],
                        [CPRdata[264],CPRdata[265],CPRdata[266],CPRdata[267]],[CPRdata[268],CPRdata[269],CPRdata[270],CPRdata[271]],[CPRdata[272],CPRdata[273],CPRdata[274],CPRdata[275]],
                        [CPRdata[276],CPRdata[277],CPRdata[278],CPRdata[279]],[CPRdata[280],CPRdata[281],CPRdata[282],CPRdata[283]],[CPRdata[284],CPRdata[285],CPRdata[286],CPRdata[287]],
                        [CPRdata[288],CPRdata[289],CPRdata[290],CPRdata[291]],[CPRdata[292],CPRdata[293],CPRdata[294],CPRdata[295]],[CPRdata[296],CPRdata[297],CPRdata[298],CPRdata[299]],
                        [CPRdata[300],CPRdata[301],CPRdata[302],CPRdata[303]],[CPRdata[304],CPRdata[305],CPRdata[306],CPRdata[307]],[CPRdata[308],CPRdata[309],CPRdata[310],CPRdata[311]],
                        [CPRdata[312],CPRdata[313],CPRdata[314],CPRdata[315]],[CPRdata[316],CPRdata[317],CPRdata[318],CPRdata[319]],[CPRdata[320],CPRdata[321],CPRdata[322],CPRdata[323]],
                        [CPRdata[324],CPRdata[325],CPRdata[326],CPRdata[327]],[CPRdata[328],CPRdata[329],CPRdata[330],CPRdata[331]],[CPRdata[332],CPRdata[333],CPRdata[334],CPRdata[335]],
                        [CPRdata[336],CPRdata[337],CPRdata[338],CPRdata[339]],[CPRdata[340],CPRdata[341],CPRdata[342],CPRdata[343]],[CPRdata[344],CPRdata[345],CPRdata[346],CPRdata[347]],
                        [CPRdata[348],CPRdata[349],CPRdata[350],CPRdata[351]],[CPRdata[352],CPRdata[353],CPRdata[354],CPRdata[355]],[CPRdata[356],CPRdata[357],CPRdata[358],CPRdata[359]],
                        [CPRdata[360],CPRdata[361],CPRdata[362],CPRdata[363]],[CPRdata[364],CPRdata[365],CPRdata[366],CPRdata[367]],[CPRdata[368],CPRdata[369],CPRdata[370],CPRdata[371]],
                        [CPRdata[372],CPRdata[373],CPRdata[374],CPRdata[375]],[CPRdata[376],CPRdata[377],CPRdata[378],CPRdata[379]],[CPRdata[380],CPRdata[381],CPRdata[382],CPRdata[383]],
                        [CPRdata[384],CPRdata[385],CPRdata[386],CPRdata[387]],[CPRdata[388],CPRdata[389],CPRdata[390],CPRdata[391]],[CPRdata[392],CPRdata[393],CPRdata[394],CPRdata[395]],
                        [CPRdata[396],CPRdata[397],CPRdata[398],CPRdata[399]]]);
  }

  var end = sheet.getRange(sheet.getLastRow(),1).getValue(); // Get the value of the last line of the sheet
  if (end == "END"){ // If the last value is "END", it means the upload is done
  setName(); // Set the sheet name
  setValue(); // Caculate compression start time, duration, end time, pause interval and average rate
  newChart(); // Generate a chart summary
  sendEmail(); // Send email to the HEMS team if this spreadsheet is full
  newSheet(); // Create a new sheet for this session
  }
  // Return result of operation
  return ContentService.createTextOutput(result);
}

function stripQuotes( value ) {
  return value.replace(/^["']|['"]$/g, "");
}

function setName(){
  //var name = Utilities.formatDate(new Date(), "CET", "yy-MM-dd/HH:mm"); // Set the sheet name based on current time
  var name = sheet.getRange(2,1).getValue() + '/' + sheet.getRange(2,2).getValue();
  sheet.setName(name);
}

function newChart() { // Generate a chart summary of this session, blue line represents the ACC value and red represents compression rate
  var lastRow = sheet.getLastRow()-1;
  var chart = sheet.newChart()
     .setChartType(Charts.ChartType.LINE)
     .addRange(sheet.getRange(2,3,lastRow,2))
     .setPosition(4, 10, 2, 2)
     .setOption('title', 'CPR Session summary')
     .setOption('width', 1000)
     .setOption('height', 400);
  sheet.insertChart(chart.build());
}

function setValue(){ // 
  var val;
  var rate;
  var avg;
  var start;
  var end;
  var startrow;
  var change = false;
  var finish = false;
  var j = 2;
  var lastrow = sheet.getLastRow();
  var data = sheet.getRange(2,4,lastrow,1).getValues(); // Take the whole values of ACC into array data
  for (i = 0; i< lastrow; i++){ // Go through every line of the ACC value in the loop
    if (data[i] > 0 && change == false){ // If rate is bigger than 90, which counts as valid compression rate
      startrow = i;
      start = sheet.getRange(i+2,2).getValue(); // Get corresponding time
      sheet.getRange(j,5).setValue(start); //Set this time as compression start time
      rate = sheet.getRange(i+2,4).getValue(); //Set corresponding compression rate as start rate
      if (j > 2){
      sheet.getRange(j-1,8).setFormula("=MINUS(R[1]C[-3],R[0]C[-1])"); // Set pause interval
      }
      change = true; // Change state
    } else if (data[i] > 0 && change == true){ // If ACC value is bigger than 90 and state changes
      val = sheet.getRange(i+2,4).getValue();
      rate = rate + val; // Accumulate rate values
    } else if (data[i] <= 0 && change == true){ // If ACC valus is smaller than 90, which counts as invalid compression rate
      end = sheet.getRange(i+1,2).getValue(); // Get corresponding time
      sheet.getRange(j,7).setValue(end); //Set this time as compression end time
      sheet.getRange(j,6).setFormula("=MINUS(R[0]C[1],R[0]C[-1])"); // Calculate CPR duration
      avg = float2int(rate/(i - startrow)); // Calculate average compression rate
      sheet.getRange(j,9).setValue(avg); // Set average rate
      j++; // Move to next row
      change = false; // Change state back
    }     
  }
// Current loop takes more than 6min to execute if the whole data is too large (> 3600 lines), which would cause a corruption becasue Google restrict the function execution time to 6min. 
// Following code tries to solve this problem by going through the loop and calculating values with arrays. But this code is not working now. It needs further development to make sure that at least 7200 lines of data can be taken care of by the funciton within 6min.
//  var ratedata = sheet.getRange(3,2,sheet.getLastRow(),1).getValues();
//  var timedata = sheet.getRange(1,2,sheet.getLastRow(),1).getValues();
//  var result = new Array(5);
//  var values = [];
//  for (i = 0; i< sheet.getLastRow(); i++){
//    if (ratedata[i] >= 90 && change == false){
//      row = i;
//      result[0] = timedata[i]; //start time
//      rate = ratedata [i]; //start rate
//      result[3] = result[0] - result[2];//pause interval
//      change = true;
//    } else if (ratedata[i] >= 90 && change == true){
//      rate = rate + ratedata[i];
//    } else if (ratedata[i] <90 && change == true){
//      result[2] = timedata[i]; //end time
//      result[1] = result[2] - result[0]; //duration
//      result[4] = float2int(rate/(i - row)); //avg rate
//      change = false;
//      finish = true;
//    }
//    if (finish == true){
//      values.push(result);
//      j++;
//      finish = false;
//    }
//      }
//  sheet.getRange(2,5,j,5).setValues(values);

//  for (i = 2; i< sheet.getLastRow(); i++){
}

function float2int (value) { // Transfer float to integer
    return value | 0;
}
  
function newSheet(){ // Create a new sheet for the next session based on the template sheet
  var template = spreadsheet.getSheetByName('template');
  var options = {template: template};
  spreadsheet.insertSheet(0,options);
  }

function sendEmail () { // Send email to HEMS team if this spreadsheet is full with 200 sheets
  var numSheets = spreadsheet.getSheets().length; // Get the number of sheets inside this spreadsheet
  var address = 'dinis@on-scenetrial.nl'; // Send email to this address with following text
  var sub = 'New CPR session on ' + sheet.getRange(2,1).getValue() + '/' + sheet.getRange(2,2).getValue() + ' is uploaded';
  var sheetUrl = spreadsheet.getUrl() + '#gid=' + sheet.getSheetId();
  var mail = 'Hi Dinis, new CPR session data is uploaded to the Google Sheets, please check: ' + sheetUrl;
  MailApp.sendEmail(address, sub, mail);
  
  var name = 'Data till ' + sheet.getRange(2,1).getValue();
  if (numSheets == 200){ // If it contains 200 sheets, which means it is full
  DriveApp.getFileById(spreadsheet.getId()).makeCopy(name); // Make a full copy of this spreadsheet in the same Google Drive to backup the spreadsheet
  //var copyurl =  DriveApp.getFilesByName(name).getUrl();
  var subject = 'Spreadsheet is full: 199 CPR sessions are collected';
  var body = 'Hi Dinis, 199 CPR sessions are collected in this spreadsheet, all these data is copied to a backup spreadsheet named as ' + name;
  MailApp.sendEmail(address,subject,body);
  for (i = 0;i<199; i++){ // Delete all the sheets in this spreadsheet except the template sheet, so this spreadsheet is ready for more sessions
    spreadsheet.deleteActiveSheet();
  }
  }
}
