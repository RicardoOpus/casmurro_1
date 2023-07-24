function changeTabColorInfos() {
  const navBarButtons = document.querySelectorAll('.navtrigger');
  navBarButtons.forEach((buton) => {
    // eslint-disable-next-line no-param-reassign
    buton.classList = 'navtrigger tabInactive';
  });
}

changeTabColorInfos();
document.getElementById('sideBar').innerHTML = '';
