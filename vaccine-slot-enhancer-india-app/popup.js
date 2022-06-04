$('#submit').click(function(){
  if($('input[type="radio"][name="group2"]:checked').val()=='pincode')
    data_valid = checkValidity();
  else 
    data_valid =1;
  if(data_valid==1){
    chrome.storage.local.set({
      'cowin_data':{'age':$("#age").val(),
      'district_id':$("#district").val(),
      'pincode':$("#pincode").val(),
      'poll_interval':$('#poll_interval').val(),
      'alert_file':$('input[type="radio"][name="group1"]:checked').val(),
      'search_by':$('input[type="radio"][name="group2"]:checked').val(), 
      'dose':$('input[type="radio"][name="dose"]:checked').val(), 
      'vaccine_dose_1':$('input[type="radio"][name="vaccine_dose_1"]:checked').val(), 
      'vaccine_dose_2':$('input[type="radio"][name="vaccine_dose_2"]:checked').val(), 
      'min_slots_dose_1':$('input[type="radio"][name="available_dose_1"]:checked').val(), 
      'min_slots_dose_2':$('input[type="radio"][name="available_dose_2"]:checked').val()}
    }, function (obj) {    
      chrome.storage.local.set({'cowin_availability':[]}, function (obj) {    
        chrome.runtime.sendMessage({greeting: "checkinfo"});
        $("#availability").html("Checking");
      });
    });
  }
})

function reload_ui(){
  poll_interval = 900000;
  chrome.storage.local.get("cowin_data", function (obj) {
    obj=obj['cowin_data'];
    if(obj){
      $('#age').val(obj['age']);
      if(obj['pincode'])
        $('#pincode').val(obj['pincode']);
      if(obj['district_id'])
        $('#district').val(obj['district_id']);

      if(obj['alert_file'])
        $('input[name="group1"][value="'+obj['alert_file']+'"]').attr('checked', 'checked');
      else
        $('input[name="group1"][value="alert.wav"]').attr('checked', 'checked');

      if(obj['dose']){
        $('input[name="dose"][value="'+obj['dose']+'"]').attr('checked', 'checked');
        if(obj['dose']==1){
          selectDose1();
        }else if(obj['dose']==2){
          selectDose2();
        }else{
          selectAnyDose();
        }
      }else{
        $('input[name="dose"][value="-1"]').attr('checked', 'checked');
      }

      if(obj['vaccine_dose_1']){
        $('input[name="vaccine_dose_1"][value="'+obj['vaccine_dose_1']+'"]').attr('checked', 'checked');
      }else{
        $('input[name="vaccine_dose_1"][value="-1"]').attr('checked', 'checked');
      }

      if(obj['vaccine_dose_2']){
        $('input[name="vaccine_dose_2"][value="'+obj['vaccine_dose_2']+'"]').attr('checked', 'checked');
      }else{
        $('input[name="vaccine_dose_2"][value="-1"]').attr('checked', 'checked');
      }

      if(obj['min_slots_dose_1']){
        $('input[name="available_dose_1"][value="'+obj['min_slots_dose_1']+'"]').attr('checked', 'checked');
      }else{
        $('input[name="available_dose_1"][value="0"]').attr('checked', 'checked');
      }

      if(obj['min_slots_dose_2']){
        $('input[name="available_dose_2"][value="'+obj['min_slots_dose_2']+'"]').attr('checked', 'checked');
      }else{
        $('input[name="available_dose_2"][value="0"]').attr('checked', 'checked');
      }

      if(obj['search_by']=='pincode' || !obj['search_by']){
        $('input[name="group2"][value="pincode"]').attr('checked', 'checked');
        disableDistrict(true);
        disablePincodes(false);
      }
      else if(obj['search_by']=='district'){
        $('input[name="group2"][value="district"]').attr('checked', 'checked');
        disableDistrict(false);
        disablePincodes(true);
      }

      poll_interval = obj['poll_interval'];
      if(!poll_interval){
        poll_interval = 900000;
      }
      $('#poll_interval').val(poll_interval);
      chrome.storage.local.get("cowin_availability", function (obj) {
        obj = obj['cowin_availability'];
        html = "<table class=\"table\"><tr><td width=\"8%\"><strong>Age</strong></td><td width=\"12%\"><strong>Zip</strong></td><td><strong width=\"30%\">Hospital</strong></td><td width=\"18%\"><strong>Date</strong></td><td width=\"20%\"><strong>Vaccine</strong></td><td width=\"17%\"><strong>Slots</strong></td></tr>";
        for(i=0;i<obj.length;i++){
          html+= "<tr><td>"+obj[i]['session']['min_age_limit']+"</td><td>"+obj[i]['obj']['pincode']+"</td><td>"+obj[i]['obj']['name']+"</td><td>"+obj[i]['session']['date']+"</td><td>"+obj[i]['session']['vaccine']+"</td><td>Dose 1 - "+obj[i]['session']['available_capacity_dose1']+"<br>Dose 2 - "+obj[i]['session']['available_capacity_dose2']+"</td></tr>";
        }
        html +="</table>";
        if(obj.length==0){
          chrome.storage.local.get("message", function (obj2) {
            if(obj2['message'] && obj2['message'].length>0){
              html ="<table class=\"table\"><tr><td><strong>"+obj2['message']+"</strong></td></tr></table>";
            }else{
              html ="<table class=\"table\"><tr><td><strong>No slots found</strong></td></tr></table>";
            }
            $("#availability").html(html);
          });
        }else{
          $("#availability").html(html);  
        }
      });
    }else{
      setDefaultValues();
    }
  });
  chrome.storage.local.get("last_checked_time", function (obj) {
    if(obj['last_checked_time'] && obj['last_checked_time'].toLocaleString().length>0){
      $("#last_checked").html("<span>Last Checked : &nbsp;&nbsp;&nbsp;"+new Date(obj['last_checked_time']).toLocaleString()+"</span><br><span>Next Check On : &nbsp;"+new Date(obj['last_checked_time']+ parseInt(poll_interval)).toLocaleString()+"</span>");
      $("#bottom_panel").show();
    }else{
      $("#bottom_panel").hide();
    }
    
  });
  
}

function checkValidity(){
  pincodes = $("#pincode").val().split(",");
  for(i=0;i<pincodes.length;i++){
    pincode = pincodes[i];
    if(!pincode.match(/^[1-9][0-9]{5}$/g)){
      $("#pin_error_message").text('Incorrect pincode \''+pincode+'\'');
      $('#pincode').css('border-color', 'red');
      return 0;
    }
  }
  if(pincodes.length>MAX_PINCODES){
    $("#pin_error_message").text('More than '+MAX_PINCODES+' pincodes entered');
    $('#pincode').css('border-color', 'red');
    return 0;
  }
  $('#pincode').css('border-color', '');
  $("#pin_error_message").text('');
  return 1;
}


chrome.runtime.onMessage.addListener( function(request,sender,sendResponse)
{
    if( request.greeting === "reload_ui" )
    {
      reload_ui();   
    }
    return true;
});

function play_alert(sound_file){
  var myAudio = new Audio();
  myAudio.src = "./"+sound_file;
  myAudio.play();
}


reload_ui();
chrome.runtime.sendMessage({greeting: "reset_badge"});
MAX_PINCODES = 8;
$("#max_pincodes").text(MAX_PINCODES);


$('input[type="radio"][name="group1"]').click(function(event){
  play_alert(event.target.value);
});

$('input[type="radio"][name="group2"]').click(function(event){
  if(event.target.value=='pincode'){
    disablePincodes(false);
    disableDistrict(true);
  }else{
    disablePincodes(true);
    disableDistrict(false);    
  }
});


function disableDistrict(disable_flag){
  $("#district").attr('disabled',disable_flag);
}

function disablePincodes(disable_flag){
  $("#pincode").attr('disabled',disable_flag);
}

function disableDoseRow(id,flag){
  $("[name='vaccine_dose_"+id+"']").attr('disabled',flag);
}

function disableSlotsRow(id,flag){
  $("[name='available_dose_"+id+"']").attr('disabled',flag);
}

function selectDose1(){
  disableDoseRow(1,false);
  disableSlotsRow(1,false);
  disableDoseRow(2,true);
  disableSlotsRow(2,true);
}

function selectDose2(){
  disableDoseRow(1,true);
  disableSlotsRow(1,true);
  disableDoseRow(2,false);
  disableSlotsRow(2,false);
}

function selectAnyDose(){
  disableDoseRow(1,false);
  disableSlotsRow(1,false);
  disableDoseRow(2,false);
  disableSlotsRow(2,false);
}

function setDefaultValues(){
  $('input[type="radio"][name="group1"][value="alert.wav"]').attr('checked',true);
  $('input[type="radio"][name="group2"][value="pincode"]').click();
  $('input[type="radio"][name="dose"][value="-1"]').attr('checked',true);
  $('input[type="radio"][name="vaccine_dose_1"][value="-1"]').click();
  $('input[type="radio"][name="available_dose_1"][value="0"]').click();
  $('input[type="radio"][name="vaccine_dose_2"][value="-1"]').click();
  $('input[type="radio"][name="available_dose_2"][value="0"]').click();

}

$('input[type="radio"][name="dose"]').click(function(event){
  if(event.target.value=='1'){
    selectDose1();
  }else if(event.target.value=='2'){
    selectDose2();
  }else{
    selectAnyDose();
  }
});