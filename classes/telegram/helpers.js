
const MessageJson = require("./messages.json")
 
const input_phase = require("./Input_Phase");
const Input_Phase = new input_phase.Input_Phase();
exports.msg_handler = (msg_name) => 
{ 
   if (MessageJson[msg_name] != null && typeof(MessageJson[msg_name]) != undefined)
   { 
     for (phase_element in MessageJson[msg_name]['phases'])
     {
         global.phase[phase_element] = MessageJson[msg_name]['phases'][phase_element];
     }
     return MessageJson[msg_name];
   }
   
   return MessageJson['error_msg'];
}
exports.set_to_zero = () => 
{
  console.log(global.phase);
  for (phase_element in global.phase)
  {
     global.phase[phase_element] = 0;
  }
  console.log(global.phase);
}
exports.parseDate  = (dateString) => 
{
           const parts = dateString.split('.');
           return new Date(parts[2], parts[1] - 1, parts[0]);
}