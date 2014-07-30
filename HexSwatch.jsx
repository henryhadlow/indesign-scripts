//DESCRIPTION:Jongware's Quick and Dirty Color Hex Box Part II
// Jongware, 13-May-2010
myDialog = app.dialogs.add ({name:"Add RGB in Hex",canCancel:true});
 
with (myDialog)
{
     with (dialogColumns.add())
     {
          with (dialogRows.add())
               staticTexts.add ({staticLabel:"RGB"});
          with (dialogRows.add())
               colorBox = textEditboxes.add({editContents:"000000"});
     }
}
if (myDialog.show())
{
     val = colorBox.editContents.toUpperCase();
     if (val.length == 6 && val.match(/^[0-9A-F]{6}$/))
     {
          redval = val.substr(0,2);
          grnval = val.substr(2,2);
          bluval = val.substr(4,2);
          red = parseInt ("0x"+redval);
          grn = parseInt ("0x"+grnval);
          blu = parseInt ("0x"+bluval);
          try {
               app.activeDocument.colors.add ({space:ColorSpace.RGB, colorValue:[red,grn,blu], name:"RGB"+redval+grnval+bluval});
          } catch (_)
          {
               alert ("Can't add this color (does it already exist?)");
          }
     } else
     {
          alert ("Invalid entry\n"+val);
     }
}