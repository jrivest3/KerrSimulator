//Calculate Orbital Frequencies

function Frequencies(a, p, e, x, En0, Lz0, Q0, r10, r20, r30, r40, zm, zp, M = 1) {
  let z1, z2, kr2, kTheta2, rp, rm, En=En0, Lz=Lz0, Q=Q0, r1=r10, r2=r20, r3=r30, r4=r40,
    hr, hp, hm, Kkr, KkTheta, Ekr, EkTheta,
    Pihr, Pihp, Pihm, Piz1,
    CapitalUpsilonr, CapitalUpsilonTheta,
    CapitalUpsilonCurlyPhi, CapitalGamma, CapitalOmegar,
    CapitalOmegaTheta, CapitalOmegaCurlyPhi;
  /* z= Cos(Theta)*/
  if(Q0==undefined){[En, Lz, Q] = KerrGeoConstantsOfMotion(a, p, e, x);}//console.log('[En, Lz, Q] from Frequencies is',[En, Lz, Q]);}
  if(r40==undefined){[r1, r2, r3, r4] = KerrGeoRadialRoots(a, p, e, x, En, Q);}//console.log('RadialRoots from Frequencies is',[r1,r2,r3,r4]);}
  /*{zminus,zplus}={Sqrt(1-x**2),Sqrt(Q/1-x**2)}/* = KerrGeoPolarRoots(a,p,e,x,En,Lz),*/
  /*{zm,zp}={zminus**2,zplus**2},
  /*For some reason, 
  Fujita and Hikida define zm=zminus**2 \(Equal) z1 and zp=
  Q/(Lz*Lz \(Epsilon)0 zm), with \(Epsilon)0=a*a(1-En*En)/Lz*Lz, 
  so that zp \(Equal) zplus**2/(a*a(1-En*En)) \(Equal) z2/(a*a(1-
  En*En)). */

  z1 = 1 - x * x;
  if (z1 == 0) { z2 = a * a * (1 - En * En) + Lz * Lz; } else { z2 = Q / z1; }
  /*P(r_)=En(r**2+a*a)-a Lz;\(CapitalSigma)=r**2+
  a*az**2; \(Laplacian) =r**2-2M r+a*a;
  /*R(r_)=P(r)**2-\(Laplacian)(r**2+(a En-Lz)**2+
  Q);\(CapitalTheta)(z_)=Q-(Q+a*a(1-En*En)+Lz*Lz) z**2+
  a*a(1-En*En) z**4,*/
  /*Tr(r_)=r2+a2\(Laplacian)P(r);TTheta(
  z_)=-a2E(1-z**2);\(CapitalPhi)r(r_)=
  a\(Laplacian)P(r);\(CapitalPhi)Theta(z_)=Lz/(1-z**2);
  \(CapitalLambda)r=
  2\(Integral)rmaxrmindrMath.sqrtR(r),\(CapitalLambda)Theta=
  4\(Integral)cosThetamin0d cosThetaMath.sqrt\(CapitalTheta)(cos\
Theta),rmin=pM1+e,rmax=
  pM1-e,Thetainc+(sgnLz)Thetamin=Math.PI2;
  CapitalUpsilonr=
  2Math.PI/\(CapitalLambda)r;CapitalUpsilonTheta=
  2Math.PI/\(CapitalLambda)Theta;*/
  /*r1=p M/(1-e);r2=
  p M/(1+e);
  ApB=2M/(1-En*En)-(r1+r2);AB=a*aQ/((1-En*En)r1 r2);
  r3=(ApB+Math.sqrt(ApB**2-4AB))/2;r4=AB/r3;
  z1=zM*M;z2=Q/(Lz*Lz\(Epsilon)0 z1);*/
  /*R(
  r_)=(1-En*En)(r1-r)(r-r2)(r-r3)(r-\
r4);
  \(CapitalTheta)(z_)=
  Lz*Lz \(Epsilon)0(z1-z**2)(z2-z**2);*//*Lz*Lz \(Epsilon)0 \
== a*a(1-En*En)*/

  /*yr(r_)=Math.sqrt((r1-r3)/(r1-r2)(r-r2)/(r\
-r3));yTheta(z_)=z/Math.sqrtz1;*/

  kr2 = (r1 - r2) / (r1 - r3) * (r3 - r4) / (r2 - r4);
  kTheta2 = z1 / z2 * a * a * (1 - En * En);
  rRadical = Math.sqrt((M + a) * (M - a));
  rp = M + rRadical;
  rm = M - rRadical;
  hr = (r1 - r2) / (r1 - r3);
  hp = (r1 - r2) * (r3 - rp) / ((r1 - r3) * (r2 - rp));
  hm = (r1 - r2) * (r3 - rm) / ((r1 - r3) * (r2 - rm));

  Kkr = Math.EllipticK(kr2); KkTheta = Math.EllipticK(kTheta2);
  Ekr = Math.EllipticE(kr2); EkTheta = Math.EllipticE(kTheta2);
  Pihr = Math.EllipticPi(hr, kr2);
  Pihp = Math.EllipticPi(hp, kr2);
  Pihm = Math.EllipticPi(hm, kr2);
  Piz1 = Math.EllipticPi(z1, kTheta2);

  CapitalUpsilonr = (Math.PI / 2) * Math.sqrt((1 - En * En) * (r1 - r3) * (r2 - r4)) / Kkr;
  CapitalUpsilonTheta = (Math.PI / 2) * Math.sqrt(z2) / KkTheta;/* 
   LzMath.sqrt(\(Epsilon)0 zp) \(Equal) Math.sqrt(Q/
   zm) \(Equal) Math.sqrtz2 */

  if (a < M) {
    CapitalGamma = 4 * M * M * En +
      /*2a2Ez+CapitalUpsilonThetaMath.PILzMath.sqrtǫ0z+ = \
(2/Math.PI)En/(1-En*En)Math.sqrtz2 CapitalUpsilonTheta */
      En / (1 - En * En) * z2 * (KkTheta - EkTheta) / KkTheta +
       /*(2/Math.PI)CapitalUpsilonr/Math.sqrt((1-En*En)(r1-\
 r3)(r2-r4))*/(1 / Kkr)
      * (En / 2
        * ((r3 * (r1 + r2 + r3) - r1 * r2) * Kkr + (r2 - r3)
          * (r1 + r2 + r3 + r4) * Pihr + (r1 - r3) * (r2 - r4) * Ekr)
        + 2 * M * En * (r3 * Kkr + (r2 - r3) * Pihr)
        + 2 * M / (rp - rm)
        * (
          ((4 * M * M * En - a * Lz) * rp - 2 * M * a * a * En)
          / (r3 - rp)
          * (Kkr - (r2 - r3) / (r2 - rp) * Pihp)
          - ((4 * M * M * En - a * Lz) * rm - 2 * M * a * a * En)
          / (r3 - rm)
          * (Kkr - (r2 - r3) / (r2 - rm) * Pihm)
          /* or ((4M*MEn+a Lz)rm+2M a*aEn)/(r3+rm)(Kkr+(r2+r3)/(r2+
          rm)Math.EllipticPi(hm,kr)) */
        )
      );

    CapitalUpsilonCurlyPhi = Lz * (Piz1 / KkTheta)/*(2/Math.PI)CapitalUpsilonTheta/Math.sqrt(Q/(\
 zm Lz*Lz)) Piz1*/+
      /*2a \CapitalUpsilonr/(Math.PI(rp-rm)Math.sqrt((1-En*En)(r1 -r3)(r2-r4)))*/
      a / (Kkr * (rp - rm))
      * ((2 * M * En * rp - a * Lz) / (r3 - rp)
        * (Kkr - (r2 - r3) / (r2 - rp) * Pihp)
        - (2 * M * En * rm - a * Lz) / (r3 - rm)
        * (Kkr - (r2 - r3) / (r2 - rm) * Pihm)
      );
  } else { throw new Error('a=1') }
  /*If(a==M,
  CapitalGamma=;CapitalUpsilonCurlyPhi=;(21)whereh\
\(PlusMinus)=);(21) is not valid for the case|a|=
  M since there exists divergent terms in1/(r+-r-)
  )*/
  CapitalOmegar = CapitalUpsilonr / CapitalGamma;
  CapitalOmegaTheta = CapitalUpsilonTheta / CapitalGamma;
  CapitalOmegaCurlyPhi = CapitalUpsilonCurlyPhi / CapitalGamma;
  return [CapitalOmegar, CapitalOmegaTheta, CapitalOmegaCurlyPhi]
}

class ResController {
  constructor(brd) {
    let that = this;
    //this.spin=a;
    //this.inc=x;
    this.curve = undefined;
    this.numPoints = 50;
    //this.graph=undefined;
    this.Controls = {
      _SelectedRatio: 'r/theta',
      _TargetRes: parseFloat((2 / 3).toPrecision(5)),
      _TargetR: 2,
      _TargetT: 3,
      _TargetP: 3,

      get SelectedRatio() { return this._SelectedRatio },
      get TargetRes() { return this._TargetRes },
      get TargetR() { return this._TargetR },
      get TargetT() { return this._TargetT },
      get TargetP() { return this._TargetP },

      set TargetR(r) { this._TargetR=r; },
      set TargetT(t) { this._TargetT=t; },
      set TargetP(p) { this._TargetP=p; },

      set SelectedRatio(string) {//Currently updates Target Resonance hased on the inputs for the three inputs
        //if (this._SelectedRatio != string) { //No major major calculations to be avoided here.
          switch (string) {
            case 'r/theta':
            case 'r/t': this._SelectedRatio = 'r/theta';
                this.TargetRes=parseFloat((this.TargetR /this.TargetT).toPrecision(5)); 
                break;
            case 'r/phi':
            case 'r/p': this._SelectedRatio = 'r/phi'; 
                this.TargetRes=parseFloat((this.TargetR /this.TargetP).toPrecision(5)); 
                break;
            case 'theta/phi':
            case 't/p': this._SelectedRatio = 'theta/phi'; 
                this.TargetRes=parseFloat((this.TargetT /this.TargetP).toPrecision(5)); 
                break;
            default:
              console.log("Input was ",string,". Invalid Input: Options are 'r/theta' or 'r/t', 'r/phi' or 'r/p', and 'theta/phi' or 't/p'.");
          }
        //}
      },
      set TargetRes(ratio) {
        if (ratio >=1) { alert('Choose a ratio that is less than or equal to 1. Omega_r <= Omega_theta <= Omega_phi');}
        else if(this._TargetRes!=ratio){this._TargetRes=ratio;}
      },
    };
    //_Frequencies: [0,0,0], _isDirty: true,/*flag to determine if calculations need to run again or if nothing has changed.*/ get Frequencies() { return this._Frequencies },set Frequencies(array)
    this.findResSurface = function (spin, ecc, inc) {//, ...args
      //Should we use only absolute values of Omega theta and/or phi? Omega theta/phi can reach -6/5 when x<~0
      function ratioFunc(ptest, numIndex, denIndex) {
        let Os = Frequencies(spin, ptest, ecc, inc);//, ...args// can't give precalculated args, because p and e being varied
        //console.log('Os= ',Os[0],Os[1],Os[2]);
        //console.log('Os args ',ptest,numIndex,denIndex,spin,ecc,inc);//,...args
        if (numIndex >= denIndex) { throw new Error('Options [0,1,2] for ratios are [r,theta,phi]. Must be in order. No repeats.'); }
        if(isNaN(Os[numIndex] / Os[denIndex])){console.log('With ptest= ',ptest,' ratioFunc is NaN for Numerator taking Frequenies index ',numIndex,' and Omega= ',Os[numIndex],' and the Denom taking index ',denIndex,' and value Omega= ',Os[denIndex]);return -1}//throw new Error('Broke')}
        return (Math.abs(Os[numIndex] / Os[denIndex]));// Using magnitude of ratio should fix things without breaking other things. Assuming it is obvious when it is negative (i.e. x<0)
      }

      var Oindex1, Oindex2;
      //var pRes;
      var Opt = that.Controls.SelectedRatio, targ = that.Controls.TargetRes;
      
      switch (Opt) { //'r/theta' is default
        default: Oindex1 = 0; Oindex2 = 1; if (Opt != 'r/theta' && Opt != 'r/t') { console.log("Invalid ratio option. Set to default 'r/theta'."); } break;
        case 'r/p':
        case 'r/phi': if (inc == 0) { //alert('Omega_phi is Indeterminate when the inclination, x, is zero.'); //x=0 gets passed through when dragging
          return -1 } Oindex1 = 0; Oindex2 = 2; break;
        case 't/p':
        case 'theta/phi': if (inc == 0) { //alert('Omega_phi is Indeterminate when the inclination, x, is zero.'); 
          return -1 } Oindex1 = 1; Oindex2 = 2; break;
      }
      
      const pmin = findSeparatrix(spin, ecc, inc)+.0001, ratatSep = ratioFunc(pmin, Oindex1, Oindex2);//pmin can give ratios that should be zero, but are complex at machine precision.

      //Test the Separatrix. 
      //Each of the (absolute values of the) ratios increase monotonically with p, so if the Separatrix is higher than the target ratio, then no solution exists.
      //if (Math.abs(targ) < Math.abs(ratatSep)) { return 0 }//Allow to continue, because the Separatrix varies with eccentricity, although only slightly.
      if (targ < ratatSep) { return 0 } // targ currently can't be negative and ratioFunc only returns abs vals
      //Also, each ratio->unity as p->infinity. (What useful handling could be done if the target ratio is 1:1?)
      function f(ptest) {
        return ratioFunc(ptest, Oindex1, Oindex2) - targ;
      }
      //if(isNaN(f(12))){throw new Error('ratioFunc returned '+ratioFunc(12, Oindex1, Oindex2).toString()+' and targ is'+ targ.toString())}
      //let pRes=newtonraphson(f,pmin,50,pmin+.01);console.log('pRes= ',pRes);
      return newtonraphson(f, pmin, 50, pmin + .01)
    };

    this.getPs = function () {
      if (this.graph == undefined) { return []; }
      return this.graph[0];
    };
    this.getEs = function () {
      if (this.graph == undefined) { return []; }
      return this.graph[1];
    };
    this.updateGraph = function (a, x) {//,...args//curve only includes points that have a solution
      let es = [], ps = [], numP = this.numPoints;
      let current_p,current_e;
      for (const t of [...Array(numP).keys()]) {
          current_e=t / (numP - 1);if(current_e==1){current_e=.991;}//console.log('for e=',current_e);
          current_p=that.findResSurface(a, current_e, x);//,...args
          if(current_p==-1){return false}
          if(current_p==0){continue;}
          es.push(current_e);
          ps.push(current_p);
      }
      if(ps.length==0){//alert('Failed to find Resonance Surface. This may be because the curve is behind the Separatrix.');
        return false}//Alert is seems to cause issues for some cases, like t/p ratios for x<0 or ratio>1
      this.graph = [ps, es];
      return true
    };
    //this.updateGraph();
    this.updateDisplay = function () {
      this.undraw();
      this.draw();
    };

    this.draw = function () {
      this.curve = brd.create('curve', [this.getPs(), this.getEs()],
        {
          needsRegularUpdate: true, strokeColor: 'blue', strokeWidth: 2
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