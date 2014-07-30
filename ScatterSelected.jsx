//Scatter.jsx
//An InDesign CS3 JavaScript
//
//This script scatters and jumbles the selected object or objects.
//
//For more on InDesign scripting, go to http://www.adobe.com/products/indesign/scripting.html
//or visit the InDesign Scripting User to User forum at http://www.adobeforums.com
//
main();
function main(){
	var myObjectList = new Array;
	if (app.documents.length != 0){
		if (app.selection.length != 0){
			for(var myCounter = 0;myCounter < app.selection.length; myCounter++){
				myObjectList.push(app.selection[myCounter]);
			}
			if (myObjectList.length != 0){
				myDisplayDialog(myObjectList);
			}
		}
		else{
			alert ("Please select an object and try again.");
		}
	}
	else{
		alert ("Please open a document, select an object, and try again.");
	}
}
function myDisplayDialog(myObjectList){
	var myDialog = app.dialogs.add({name:"Scatter"});
	with(myDialog){
		with(dialogColumns.add()){
			with(borderPanels.add()){
				with(dialogColumns.add()){
					staticTexts.add({staticLabel:"Fixed Rotation", minWidth:150});
				}
				with(dialogColumns.add()){
					var myRotateAmountField =  realEditboxes.add({editValue:0});
				}
			}
			with(borderPanels.add()){
				with(dialogColumns.add()){
					with(dialogRows.add()){
						with(dialogColumns.add()){
							staticTexts.add({staticLabel:"Random rotation min.:", minWidth:150});
						}
						with(dialogColumns.add()){
							var myRandomRotateMinAmountField =  realEditboxes.add({editValue:0});
						}
						with(dialogColumns.add()){
							staticTexts.add({staticLabel:"max.:"});
						}
						with(dialogColumns.add()){
							var myRandomRotateMaxAmountField =  realEditboxes.add({editValue:0});
						}
					}
					with(dialogRows.add()){
						with(dialogColumns.add()){
							staticTexts.add({staticLabel:"Max random X-translation:", minWidth:150});
						}
						with(dialogColumns.add()){
							var myRandomTranslateXAmountField =  measurementEditboxes.add({editValue:0, editUnits:MeasurementUnits.points});
						}
					}
					with(dialogRows.add()){
						with(dialogColumns.add()){
							staticTexts.add({staticLabel:"Max random Y-translation:", minWidth:150});
						}
						with(dialogColumns.add()){
							var myRandomTranslateYAmountField =  measurementEditboxes.add({editValue:0, editUnits:MeasurementUnits.points});
						}
					}
					/* with(dialogRows.add()){
						with(dialogColumns.add()){
							staticTexts.add({staticLabel:"Max random X-scale:", minWidth:150});
						}
						with(dialogColumns.add()){
							var myRandomScaleXAmountField =  percentEditboxes.add({editValue:0});
						}
					}
					with(dialogRows.add()){
						with(dialogColumns.add()){
							staticTexts.add({staticLabel:"Max random Y-scale:", minWidth:150});
						}
						with(dialogColumns.add()){
							var myRandomScaleYAmountField =  percentEditboxes.add({editValue:0});
						}
					} */
					with(borderPanels.add()){
						with(dialogColumns.add()){
							staticTexts.add({staticLabel:"Anchor Point:"});
							var myAlignmentButtons = radiobuttonGroups.add();
							with(myAlignmentButtons){
								radiobuttonControls.add({staticLabel:"Left-Top"});
								radiobuttonControls.add({staticLabel:"Left-Center"});
								radiobuttonControls.add({staticLabel:"Left-Bottom"});
								radiobuttonControls.add({staticLabel:"Center-Top"});
								radiobuttonControls.add({staticLabel:"Center-Center", checkedState: true});
								radiobuttonControls.add({staticLabel:"Center-Bottom"});
								radiobuttonControls.add({staticLabel:"Right-Top"});
								radiobuttonControls.add({staticLabel:"Right-Center"});
								radiobuttonControls.add({staticLabel:"Right-Bottom"});
							}
						}
					}
				}
			}
		}
	}
	var myResult = myDialog.show();
	if(myResult == true){
		//Get the values from the dialog box controls
		var myRotateAmount = myRotateAmountField.editValue;
		var myRandomRotateMinAmount = myRandomRotateMinAmountField.editValue;
		var myRandomRotateMaxAmount = myRandomRotateMaxAmountField.editValue;
		var myRandomTranslateXAmount = myRandomTranslateXAmountField.editValue;
		var myRandomTranslateYAmount = myRandomTranslateYAmountField.editValue;
		var myAlignment = myAlignmentButtons.selectedButton;
		var  myAnchor = AnchorPoint.TOP_LEFT_ANCHOR;
		switch (myAlignment){
			case 0:
				myAnchor = AnchorPoint.TOP_LEFT_ANCHOR;
				break;
			case 1:
				myAnchor = AnchorPoint.LEFT_CENTER_ANCHOR;
				break;
			case 2:
				myAnchor = AnchorPoint.BOTTOM_LEFT_ANCHOR;
				break;
			case 3:
				myAnchor = AnchorPoint.TOP_CENTER_ANCHOR;
				break;
			case 4:
				myAnchor = AnchorPoint.CENTER_ANCHOR;
				break;
			case 5:
				myAnchor = AnchorPoint.BOTTOM_CENTER_ANCHOR;
				break;
			case 6:
				myAnchor = AnchorPoint.TOP_RIGHT_ANCHOR;
				break;
			case 7:
				myAnchor = AnchorPoint.RIGHT_CENTER_ANCHOR;
				break;
			case 8:
				myAnchor = AnchorPoint.BOTTOM_RIGHT_ANCHOR;
				break;
		} 		
		
		/* var myRandomScaleXAmount = myRandomScaleXAmountField.editValue;
		var myRandomScaleYAmount = myRandomScaleYAmountField.editValue; */
		myDialog.destroy();
		myScatter(myObjectList, myRotateAmount, myRandomRotateMinAmount, myRandomRotateMaxAmount, myRandomTranslateXAmount, myRandomTranslateYAmount, myAnchor);
	}
	else{
		myDialog.destroy();
	}
}
function myScatter(myObjectList, myRotateAmount, myRandomRotateMinAmount, myRandomRotateMaxAmount, myRandomTranslateXAmount, myRandomTranslateYAmount, myAnchor){	
	var myDocument = app.activeDocument;
	for(var myObjectCounter = 0; myObjectCounter<myObjectList.length; myObjectCounter++){
		var myObject = myObjectList[myObjectCounter];
		// only do fixed rotation if user entered value other than Zero
		if(myRotateAmount != 0){myRotate(myObject, myAnchor, myRotateAmount, false);}
		// only do random rotation if user entered value other than Zero into the RandomRotateMinAmount or RandomRotateMaxAmount field
		if((Math.abs(myRandomRotateMinAmount)+Math.abs(myRandomRotateMaxAmount)) != 0){myRandomRotate(myObject, myAnchor, myRandomRotateMinAmount, myRandomRotateMaxAmount, false);}
		// What this does: If x and y both zero then do nothing. If value entered for either x or y field then do a x,y translation 
		if((Math.abs(myRandomTranslateXAmount)+Math.abs(myRandomTranslateYAmount)) != 0){myRandomTranslate(myObject, myAnchor, myRandomTranslateXAmount, myRandomTranslateYAmount);}
	    /* only do random scale if user entered value other than Zero
		if((Math.abs(myRandomScaleXAmount)+Math.abs(myRandomScaleYAmount)) != 0){
			myScale(myObject, AnchorPoint.centerAnchor, myRandomScaleXAmount, myRandomScaleYAmount, false);
		} */
	}
}
function myRotate(myObject, myAnchor2, myAngle, myUseRulerCoordinates){ 
	var myTransformationMatrix = app.transformationMatrices.add({counterclockwiseRotationAngle:myAngle}); 
	myObject.transform(CoordinateSpaces.pasteboardCoordinates, myAnchor2, myTransformationMatrix, undefined, myUseRulerCoordinates); 
} 
function myScale(myObject, myAnchor2, myXScale, myYScale, myUseRulerCoordinates){ 
	var myTransformationMatrix =  app.transformationMatrices.add({horizontalScaleFactor:myXScale, verticalScaleFactor:myYScale}); 
	myObject.transform(CoordinateSpaces.pasteboardCoordinates, myAnchor2, myTransformationMatrix, undefined, myUseRulerCoordinates); 
} 
function myTranslate(myObject, myAnchor2, myXTranslate, myYTranslate){ 
	var myTransformationMatrix =  app.transformationMatrices.add({horizontalTranslation:myXTranslate, verticalTranslation:myYTranslate}); 
	myObject.transform(CoordinateSpaces.pasteboardCoordinates, myAnchor2, myTransformationMatrix);	 
}
function myRandomRotate(myObject, myAnchor2, myMinAngle, myMaxAngle, myUseRulerCoordinates){ 
	var myRandomAngle = (Math.random()*(myMaxAngle - myMinAngle)) + myMinAngle;
	var myTransformationMatrix = app.transformationMatrices.add({counterclockwiseRotationAngle:myRandomAngle}); 
	myObject.transform(CoordinateSpaces.pasteboardCoordinates, myAnchor2, myTransformationMatrix, undefined, myUseRulerCoordinates); 
} 
function myRandomScale(myObject, myAnchor2, myXScale, myYScale, myUseRulerCoordinates){ 
	var myRandomXScale = Math.random()*myXScale;
	var myRandomYScale = Math.random()*myYScale;
	var myTransformationMatrix =  app.transformationMatrices.add({horizontalScaleFactor:myRandomXScale, verticalScaleFactor:myRandomYScale}); 
	myObject.transform(CoordinateSpaces.pasteboardCoordinates, myAnchor2, myTransformationMatrix, undefined, myUseRulerCoordinates); 
} 
function myRandomTranslate(myObject, myAnchor2, myXTranslate, myYTranslate){
	var myRandomXTranslate = Math.random()*myXTranslate;
	var myRandomYTranslate = Math.random()*myYTranslate;
	var myTransformationMatrix =  app.transformationMatrices.add({horizontalTranslation:myRandomXTranslate, verticalTranslation:myRandomYTranslate}); 
	myObject.transform(CoordinateSpaces.pasteboardCoordinates, myAnchor2, myTransformationMatrix);	 
}