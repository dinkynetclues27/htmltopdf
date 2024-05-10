module.exports = {
    formate: 'A4',
    orientatin:'portrait',
    border:'8mm',
    header:{
        height:"15mm",
        contents: '<h4 style="color:red;font-size:20;font-weight:800;text-align:center;">Customer Invoice </h4>'
    },
    footer:{
        height:'20mm',
        // contents:'cover page',
        // 2:'second page',
        default:'<span style="color:#444;">{{page}}</span>/<span>{{pages}}</span>',
        last:'last page'
    }
}