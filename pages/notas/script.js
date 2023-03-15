console.log("SCRIPT NOTAS");

  changeTabColor("notas");

  $(function() {
    $("#sortable").sortable({
      update: function(event, ui) {
        savePositions();
      }
    });
    $("#sortable").disableSelection();
  
    function savePositions() {
      var positions = [];
      $("#sortable .portlet").each(function() {
        var id = $(this).attr("id");
        var position = $(this).index();
        positions.push(id + ":" + position);
      });
      // Aqui você pode enviar as posições para um servidor usando ajax, por exemplo
      console.log(positions);
    }
  });