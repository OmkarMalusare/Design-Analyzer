var makeReport = function(projectFile) {
  var fs = require('fs');
  fs.readFile(projectFile, 'utf8', function(err, contents) {
      jsonFile = JSON.parse(contents);
      var classJson = jsonFile["ownedElements"];
      var arrClasses = classJson[0].ownedElements;
      var noOFClasses = arrClasses.length-1;
      var dict_classToID = {};
      var dict_Responsibility = {};
      var dict_Instability = {};
      for(var i=1; i<arrClasses.length;i++){
        var ownedElementsLength = arrClasses[i].ownedElements;
        if(ownedElementsLength != null && typeof ownedElementsLength != null){
        dict_Instability[arrClasses[i].name] = ownedElementsLength.length;
      }
      if(ownedElementsLength == null || typeof ownedElementsLength == null){
      dict_Instability[arrClasses[i].name] = 0;
    }
    }
    for(var i=1; i<arrClasses.length;i++){
      dict_classToID[arrClasses[i]._id] = arrClasses[i].name;
  }
  for(var i=1; i<arrClasses.length;i++){
    dict_Responsibility[arrClasses[i].name] = 0;
  }

  for(var i=1; i<arrClasses.length;i++){
    var ownedElementsL = arrClasses[i].ownedElements;
    if(ownedElementsL != null && typeof ownedElementsL != null){
      for(var j=0; j<ownedElementsL.length; j++){
      if(ownedElementsL[j]._type == "UMLDependency" || ownedElementsL[j]._type == "UMLGeneralization" || ownedElementsL[j]._type == "UMLInterfaceRealization"){
          dict_Responsibility[dict_classToID[ownedElementsL[j].target.$ref]] += 1;
      }
      if(ownedElementsL[j]._type == "UMLAssociation"){
        if(ownedElementsL[j].end1.navigable){
          dict_Responsibility[dict_classToID[ownedElementsL[j].end1.reference.$ref]] += 1;
          dict_Instability[dict_classToID[ownedElementsL[j].end2.reference.$ref]] +=1;

        }
        dict_Responsibility[dict_classToID[ownedElementsL[j].end2.reference.$ref]] += 1;
      }
  }
  }
  }

  for(var i=1; i<arrClasses.length;i++){
  var operationsEeach = arrClasses[i].operations;
  if(operationsEeach != null && typeof operationsEeach != null){
     for(var j=0; j<operationsEeach.length; j++){
       var parametersEeach = operationsEeach[j].parameters;
       if(parametersEeach != null && typeof parametersEeach != null){
        for(var k=0; k<parametersEeach.length; k++){
          dict_Responsibility[dict_classToID[parametersEeach[k].type.$ref]] += 1;
          dict_Instability[arrClasses[i].name] += 1;
        }
  }
     }
   }
  }
  console.log("Class Name"+"    "+"Responsibility"+"    "+"Instability"+"    "+"Stability"+"    "+"Deviance");
  for(var c=1; c<arrClasses.length;c++){
  console.log((arrClasses[c].name).padEnd(10)+"       "+(dict_Responsibility[arrClasses[c].name]/noOFClasses).toFixed(2)+"            "+(dict_Instability[arrClasses[c].name]/noOFClasses).toFixed(2)+"           "+ (1 - (dict_Instability[arrClasses[c].name]/noOFClasses).toFixed(2)).toFixed(2)+"         "+ Math.abs(((dict_Responsibility[arrClasses[c].name]/noOFClasses)- (1 - (dict_Instability[arrClasses[c].name]/noOFClasses))).toFixed(2)));
  }

  }
  );
};

var main = function() {
   var readline = require('readline');
   var rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
   });

   rl.question("Enter file name: ", function(answer) {
      makeReport(answer);
      rl.close();
    });
};
main();
