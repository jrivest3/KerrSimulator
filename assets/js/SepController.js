
class SepController {
    constructor(brd) {
        //this.spin=a;
        //this.inc=x;
        this.curve = undefined;
        this.numPoints = 20;
        //this.graph=undefined;
        this.getPs = function () {
            if (this.graph == undefined) { return []; }
            return this.graph[0];
        };
        this.getEs = function () {
            if (this.graph == undefined) { return []; }
            return this.graph[1];
        };
        this.updateGraph = function (a, x) {
            let es = this.getEs(), ps = [], /*a=this.spin, x=this.inc, */ numP = this.numPoints;
            if (es.length == 0) {
                for (const t of [...Array(numP).keys()]) {
                    es.push(t / (numP - 1));
                }
            }
            for (const t of [...Array(numP).keys()]) {
                ps.push(findSeparatrix(a, es[t], x));
            }

            this.graph = [ps, es];

        };
        //this.updateGraph();
        this.updateDisplay = function () {
            this.undraw();
            this.draw();
        };

        this.draw = function () {
            this.curve = brd.create('curve', [this.getPs(), this.getEs()],
                {
                    needsRegularUpdate: true, strokeColor: '#aa2233', strokeWidth: 2
                    //,numberPointsLow:57,numberPointsHigh:200,recursionDepthLow:4,recursionDepthHigh:9
                });
        };
        this.undraw = function () {
            if (this.curve != undefined) {
                brd.removeObject(this.curve);
                this.curve = undefined;
            }
        };
    }
}


//function yvar(e){return e}
//function xvar(e){//console.log(a.Value(),e,x.Value());
//         return findSeparatrix(a.Value(),e,x.Value())}
//brd.suspendUpdate();



function query(){
let A=a.Value();let X=x.Value();let e=q.X();
 let schwarz=6+2*e;
    if(A==0){return schwarz;}
    let Spol= new Polynomial(coeffunc(A,e,0));
    let polmin=1+Math.sqrt(3)+Math.sqrt(3+2*Math.sqrt(3));
    if(X==0&&A==1){return polmin;}
    let value=Spol.eval(q.Y());
    console.log(q.Y(),value);
    let ppol= newtonraphson(function(p){return Spol.eval(p);},polmin,schwarz,(polmin+schwarz)/2,maxIter=100,tol=10**(-6));
    if(X==0){return ppol;}
    
console.log("ppol="+newtonraphson(function(p){return Spol.eval(p);},polmin,schwarz,(polmin+schwarz)/2,maxIter=100,tol=10**(-6)));

}

//function updateSep(a,x,numPoints=100){
//    document.getElementById(
//}
