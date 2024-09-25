function swap(pkg){
    const img1 = document.getElementById(pkg+"-img-1");
    const img2 = document.getElementById(pkg+"-img-2");
    const type = document.getElementById(pkg+"-type")

    if(img1.hidden){
        type.innerHTML = img1.getAttribute("type");
        img1.hidden = false;
        img2.hidden = true;
    }else {
        type.innerHTML = img2.getAttribute("type");
        img1.hidden = true;
        img2.hidden = false;
    }
}

function selectPkg(pkg, png){
    const png2 = png ? "&png="+png : "";
    window.location.href = "form.html"+"?pkg=" + pkg+""+png2;
}