function newtonraphson(f, xlow, xhigh, xStart, maxIter = 16, tol = 10 ** (-8), restrain = true) {
    if (xlow > xhigh || xStart < xlow || xStart > xhigh) { throw new Error(`Upper bound must be higher than lower bound. xStart should be in between. (function,xlow,xhigh,xStart,...args)`) }
    var x0 = xStart;
    function dfdx(x0, f, dx = tol / 2.0) { //console.log('change in f =',f(x0 + dx*10),f(x0 + dx) ,f(x0 + dx/2), f(x0));
        return (f(x0 + dx) - f(x0)) / dx }  //Use euler to get derivative
    //Loop until x0 changes less than tol
    var i;
    var err = false;//flag to allow one step out of bounds, but quit if this creates an infinite loop.
    //Restrained Loop
    if (restrain && (xlow < xhigh)) {//making the bounds equal to each other will remove them.
        let restraint = 1 - tol;//Because the search is restricted to a range, shallow slopes can make stepsizes too large. The restraint reduces the stepsize.
        for (i = 0; i <= maxIter; i++) {
            let slope = dfdx(x0, f, dx = (xhigh - xlow) / 1000.);//function(){if(xhigh - xlow<.1){return 10.}else if(xhigh - xlow<1){return 100.}else{return 1000.}});
            if(slope==0){throw new Error('slope=0')}
            let shift = f(x0) / slope;
            // console.log("slope="+slope+"\nx0= "+x0+"    f(x0)= "+f(x0)+"\nshift= "+shift,xlow, xhigh)
            // //restrain=true;
            // if(restrain){

            //Step (almost) onto the boundary, instead of over it. 
            if (shift > (x0 - xlow) && Math.abs(x0 - xlow) > tol / 100) { shift = (x0 - xlow) } else if (shift < (x0 - xhigh) && Math.abs(x0 - xhigh) > tol / 100) { shift = (x0 - xhigh) }
            /*          if( (shift > 0 && shift < (x0-xlow)) || (shift < 0 && shift > (x0-xhigh)) )//shift gets subtracted.
                      {//restrain=false;
                          restraint=1;//console.log("restraint removed on step");
                      } //If it's not going to go too far to the right or too far to the left, then the restraint can be removed to speed it up.
                      else
                      {restraint=(xhigh-xlow)/1000;//*Math.abs(slope)**(1/3);
                       //let xnewp;
                           while( (shift > 0 && shift*restraint < (x0-xlow)*.99) || (shift < 0 && shift*restraint > (x0-xhigh)*.95) )// if the restraint can be reduced, then do so.
                           {restraint/=.95;//console.log("restraint reduced");
                            /*if(shift>0){}   //test the bounds of the interval  // Find proper lower bound of the interval
                       let sign_left = Math.sign(eqn(left));
                       let sign_right = Math.sign(eqn(right));
                       if(sign_left == sign_right) {
                            throw new Error(`The given bounds do not contain exactly one root.`)
                       }
                            xnewp=x0-shift*restraint;
                               if(xnewp<xlow||xnewp>xhigh){ }
                               */
            /*               }
                      }*/
            // }

            let xnew = x0 - shift * restraint;
            //console.log("shift= "+f(x0)/slope*restraint)
            if (Math.abs(f(x0)/*xnew-x0*/) < tol) {
                //console.log("N-R Found root in "+i+" iterations.")
                //console.log("slope="+slope+"\nx0= "+x0+"    f(x0)= "+f(x0)+"\nshift= "+shift,xlow, xhigh)
                break;
            }
            // m=-f(x0)/(xnew-x0);
            if (i >= maxIter - 1 || xnew >= xhigh || xnew <= xlow) {
                 console.log("N-R method stepped out of bounds. "+x0+" "+xnew+" "+shift*restraint,"xlow",xlow);
                //break;

                if (!err) {
                    err = true;console.log("erred on step ",i,x0,xnew,xlow,xhigh,f(x0),f(xnew));
                    if (xnew <= xlow) { xnew = xhigh; } else if (xnew >= xhigh) { xnew = xlow; }
                    i = 0;
                }//Perhaps the choice of starting point led the method away  from the desired root. So start over with the initial point placed at the bound opposite the one that was breached.
                else {
                    let hope;console.log("N-R didn't work. Trying Bisection...",i,xlow,x0,xhigh);//instead of guessing more starting points, try the bisection method before giving up.
                    if (xnew < xlow && x0 > xlow) {
                        hope = bisection(f, xlow, x0, undefined, tol, undefined, undefined, true);//console.log(xnew,x0,hope);
                    }
                    else if (xnew > xhigh && x0 < xhigh) {
                        hope = bisection(f, x0, xhigh, undefined, tol, undefined, undefined, true);//console.log(x0,hope);
                    }
                    if (typeof hope === 'undefined') {
                        hope = bisection(f, xlow, xhigh, undefined, tol, undefined, undefined, true);//console.log("last",hope,xlow,xhigh);
                    }

                    if (typeof hope === 'undefined') { throw new Error(`No roots found within the given bounds.`) }
                    else { return hope }
                }
            }

            x0 = xnew;

        }
    }

    //Regular Loop
    else {
        for (i = 0; i <= maxIter; i++) {
            let slope = dfdx(x0, f, dx = Math.abs(xhigh - xlow) / 1000.);
            let shift = f(x0) / slope;
            //console.log("slope="+slope+"\nx0= "+x0+"    f(x0)= "+f(x0)+"\nshift= "+shift)
            let xnew = x0 - shift;

            if (Math.abs(xnew - x0) < tol) {
                //console.log("Found root in " + i + " iterations.")
                break;
            }
            // m=-f(x0)/(xnew-x0);
            //if(xnew>xhigh){x0=xlow;}
            //else if (xnew<xlow){x0=xhigh;}
            //else{x0=xnew;}
            x0 = xnew;
        }
    }

    if (i >= maxIter) { throw new Error(`No roots were found after ${maxIter} iterations.\nmin=${xlow} max=${xhigh} x0=${x0}`) }
    //else{console.log("From initial guess "+ xStart+ ", the root found was: "+ x0 +"\nmin="+xlow+" max="+xhigh)}

    return x0
}

function bisection(eqn, left, right, stepSize = 0.001, tol = 10 ** (-8), ctr = 0, limit = 10000, no_err = false) {
    if (left >= right) { throw new Error(`bad bounds`) }
    //test the bounds of the interval  // Find proper lower bound of the interval
    let sign_left = Math.sign(eqn(left));
    let sign_right = Math.sign(eqn(right));
    if (sign_left == sign_right) {
        if (no_err) {console.log("stop1",left,eqn(left),right,eqn(right));
            return
        }
        console.log("stop2");
        throw new Error(`The given bounds do not contain exactly one root.`)
    }
    //  while(result_left * result_right > 0 && ctr++ < limit) {
    //    if(Number.isNaN(result_left)) {
    //      while (Number.isNaN(result_left)) {//discontinuities tend to be to the left of the roots that I'm looking for.
    //        left += stepSize/10;
    //        result_left = eqn(left);
    //      }}
    //    else{left -= stepSize;result_left = eqn(left);}
    //    //if (Number.isNaN(result_right)) {
    //    //    while (Number.isNaN(result_right)) {
    //    //	right += stepSize;
    //    //	result_right = eqn(right);
    //    //}}
    //
    //    //right += stepSize;
    //    //scope_right[variable] = right;
    //    //result_right = math.eval(eqn, scope_right);
    //  }
    //  if (ctr >= limit) {
    //    throw new Error(`Could not find the interval within ${ctr} iterations`)
    //  }
    //find root
    let mid = (left + right) / 2;
    let f_mid = eqn(mid);
    while (Math.abs(f_mid) > tol) {
        ctr++;
        if (ctr >= limit) {
            if (no_err) { console.log("Bisection took too long.", ctr, f_mid); return }
            console.log("stop2p");
            throw new Error(`Could not find the root within ${ctr} iterations`)
        }

        if (Math.sign(f_mid) == sign_left) {
            left = mid;
        } else {
            right = mid;
        }
        mid = (left + right) / 2;
        f_mid = eqn(mid);
    }
    //    while (right - left > tol) {
    //        let mid = (left + right) / 2;
    //        let f_mid = eqn(mid);
    //        let f_left = eqn(left);
    //        if (f_left * f_mid > 0) {
    //            left = mid;
    //        } else {
    //            right = mid;
    //        }
    //    }
    console.log("mid=",mid," f_mid=",f_mid," on step# ",ctr,Math.abs(f_mid),tol,limit);
    console.log("Bisection only took", ctr, "steps.")
    return mid
}

function brentmethod(func, left, right, del = Math.abs(right - left) / (2 ** 10), tol = 10 ** (-8), limit = 100) {
    var k = 0;
    var a = left, b = right,//the right bound is used as the initial guess for the root for the k=0 iteration.
        fa = func(a), fb = func(b);
    if (fa * fb >= 0) { console.log(a, fa, b, fb); throw new Error(`The given bounds do not contain exactly one root.`) }
    if (Math.abs(fa) < Math.abs(fb)) { [a, b, fa, fb] = [b, a, fb, fa]; }//if the left bound is a better guess, swap a and b before starting.
    var s, fs;
    var b1 = a, b2;//b1 is b(k-1), b2 is b(k-2)
    var fc = func(b1);
    var mflag = true;//this is used to remember which method was used in the previous step
    var i = 0;
    var converger;
    do {
        k = k + 1; let bis = false;
        if (fa != fc && fb != fc) {// do inverse quadratic interpolation
            let t1 = (a * fb * fc) / ((fa - fb) * (fa - fc)), t2 = (b * fa * fc) / ((fb - fa) * (fb - fc)), t3 = (b1 * fa * fb) / ((fc - fa) * (fc - fb));
            s = t1 + t2 + t3;
        } else {// do secant method
            s = b - fb * (b - a) / (fb - fa);
        }
        //five conditions that make this step a bisection step.
        if (!((b < s && s < (3 * a + b) / 4) || ((3 * a + b) / 4 < s && s < b))
            || (mflag == true && Math.abs(s - b) >= Math.abs(b - b1) / 2)
            || (mflag == true && Math.abs(b - b1) < del)
            || (mflag == false && Math.abs(s - b) >= Math.abs(b1 - b2) / 2)
            || (mflag == false && Math.abs(b1 - b2) < del)
        ) { mflag = true; bis = true } else { mflag = false; i = i + 1; }
        if (bis) {//do a bisection step instead
            s = (a + b) / 2;

        }
        fs = func(s);
        //prep for next step
        b2 = b1;
        b1 = b; fc = fb;
        if (fa * fs < 0) { b = s; fb = fs; } else { a = s; fa = fs; }
        if (Math.abs(fa) < Math.abs(fb)) { [a, b, fa, fb] = [b, a, fb, fa]; }
        let slope = Math.abs((fs - fc) / (s - b1));
        if (slope > 1) { converger = Math.abs(fs); }// check the slope and switch the converger to be the step size if the slope near the root is too small.
        else { converger = Math.abs(s - b1); }
    } while (converger > tol && k <= limit)
    //console.log(i,"interpolations and k=",k)
    if (k >= limit) { return bisection(func, left, right, undefined, tol, undefined, limit) }//throw new Error(`Brent's method exceeded ${limit} steps.`)}
    //else{console.log("Brent found root before k=",k)}
    return s
}

//function laguerre
//function deflatepolynimial

//Aberth's method

function SepPoly(a, e, x) {
    return [a ** 12 * (-1 + e) ** 4 * (1 + e) ** 8 * (-1 + x ** 2) ** 4, -4 * a ** 10 * (-3 + e) * (-1 + e) ** 3 * (1 + e) ** 7 * (-1 + x ** 2) ** 4,
    2 * a ** 8 * (-1 + e) ** 2 * (1 + e) ** 6 * (-1 + x ** 2) ** 3 * (2 * (-3 + e) ** 2 * (-1 + x ** 2) +
        a ** 2 * (-3 + 2 * e - 3 * e ** 2 + (-1 + e) * (3 + e) * x ** 2)), -4 * a ** 8 * (-1 + e) * (1 + e) ** 5 * (-1 + x ** 2) ** 3 *
    (7 - 7 * e + 13 * e ** 2 - 5 * e ** 3 + (-1 + e) * (7 + e ** 2) * x ** 2), a ** 6 * (1 + e) ** 4 * (-1 + x ** 2) ** 2 *
    (-16 * (-3 + e) * (-1 + e) ** 2 * (1 + e) * (-1 + x ** 2) + a ** 2 * (15 + e * (-20 + e * (26 + 5 * e * (-4 + 3 * e))) + 6 * x ** 2 -
        2 * e * (2 + e) * (2 + e * (-6 + 5 * e)) * x ** 2 + (-1 + e) ** 2 * (3 + e) ** 2 * x ** 4)),
    8 * a ** 6 * (-1 + e) * (1 + e) ** 3 * (-1 + x ** 2) ** 2 * (3 + e + e ** 2 - 5 * e ** 3 + 2 * (6 + e * (2 + e + e ** 2)) * x ** 2),
    -4 * a ** 4 * (1 + e) ** 2 * (-1 + x) * (1 + x) * (-2 * (11 - 14 * e ** 2 + 3 * e ** 4) * (-1 + x ** 2) +
        a ** 2 * (5 + 6 * e ** 2 + 5 * e ** 4 - (5 + e ** 2 * (6 + e * (8 + 5 * e))) * x ** 2 + (-1 + e) * (3 + e) * (3 + e * (2 + e)) * x ** 4)),
    -8 * a ** 4 * (1 + e) ** 2 * (-1 + x) * (1 + x) * (-3 + e - e ** 2 - 5 * e ** 3 + (15 + e * (-5 + 3 * e * (1 + e))) * x ** 2),
    -16 * a ** 2 * (-1 + e) * (1 + e) ** 2 * (3 + e) * (-1 + x ** 2) + a ** 4 * (15 + 20 * e + 26 * e ** 2 + 20 * e ** 3 + 15 * e ** 4 -
        4 * (9 + e * (12 + e * (18 + e * (12 + 5 * e)))) * x ** 2 + 2 * (15 + e * (2 + e) * (10 + 3 * e * (2 + e))) * x ** 4),
    4 * a ** 2 * (-7 + e * (-7 + e * (-13 - 5 * e + 4 * (3 + e) * x ** 2))),
    4 * (3 + e) ** 2 + 2 * a ** 2 * (3 + 2 * e + 3 * e ** 2 - 2 * (3 + e * (2 + e)) * x ** 2), -4 * (3 + e), 1]
}
function polSepPoly(a, e) {
    return [a ** 6 * (-1 + e) ** 2 * (1 + e) ** 4, (-6 * a ** 4 * (1 + e) ** 2 + 2 * a ** 4 * e * (1 + e) ** 2 +
        6 * a ** 4 * e ** 2 * (1 + e) ** 2 - 2 * a ** 4 * e ** 3 * (1 + e) ** 2),
    (3 * a ** 4 * (1 + e) ** 2 - 2 * a ** 4 * e * (1 + e) ** 2 + 3 * a ** 4 * e ** 2 * (1 + e) ** 2),
    (4 * a ** 2 + 4 * a ** 2 * e - 4 * a ** 2 * e ** 2 - 4 * a ** 2 * e ** 3), (3 * a ** 2 + 2 * a ** 2 * e + 3 * a ** 2 * e ** 2), (-6 - 2 * e), 1]
}
function equatSepPoly(a, e) { return [a ** 4 * (e - 3) ** 2 * (1 + e) ** 2, -4 * a ** 2 * (1 + e) * (7 + e ** 2), (2 * a ** 2 * (e - 3) * (1 + e) + 4 * (3 + e) ** 2), -4 * (3 + e), 1] }

function makeguesses(n) {//n is number of roots
    var gs = [];
    for (var i = 0; i < n; i++) {
        var c = new Complex(i, i);
        gs.push(c);
    }
    return gs
}

function findreals(roots, eps) {
    var reals = [];
    for (var i = 0; i < roots.length; i++) {
        if (Math.abs(roots[i].im) < eps) {
            reals.push(roots[i].re);
        }
    }
    reals.sort((a, b) => b - a);//sorts in descending order
    console.log("real roots " + reals.length);
    console.log(reals);
    return reals
}

function FindtheSep(a, e, x) {
    let coeffs = SepPoly(a, e, x);
    let p = new Polynomial(coeffs);
    console.log("p");
    console.log(p.toString());
    let roots = p.complexRoots(makeguesses(coeffs.length - 1));
    console.log("roots");
    console.log(roots);
    let realroots = findreals(roots.root, 10 ** (-6));
    if (x < 0) { return realroots[1]; }
    else { return realroots[0]; }
}
//end of Aberth's

//What we are actually using
function findSeparatrix(a, e, x) {//Bracketing method

    let schwarz = 6 + 2 * e;
    if (a < 0.01) { return schwarz; }
    let polmin = 1 + Math.sqrt(3) + Math.sqrt(3 + 2 * Math.sqrt(3));
    if (x == 0 && a == 1 && e == 0) { return polmin; }
    let Spol = new Polynomial(polSepPoly(a, e));
    let leeway = 0.0001;//may help if the root is very close to the boundary
    let toler = 10 ** (-3);
    if (e < -0.0000001) { throw new Error('e is negative!') }
    if (Math.abs(x) <= 0.1) { toler = 10 ** (-4); }
    let ppol = brentmethod(function (p) { return Spol.eval(p); }, polmin, schwarz, undefined, toler);//newtonraphson(function(p){return Spol.eval(p);},polmin,schwarz,(polmin+schwarz)/2,undefined,10**(-2),undefined,'function value');//undefined,tol=10**(-4),undefined,limit=1000);//
    if (Math.abs(x) < 0.01) { return ppol; }
    let Sequat;
    let pequat;
    if (x > 0) {
        Sequat = new Polynomial(equatSepPoly(a, e));
        if (a > .995) { pequat = 1 + e; }
        else {
            pequat = brentmethod(function (p) { return Sequat.eval(p); }, 1 + e, schwarz, undefined, toler);//newtonraphson(function(p){return Sequat.eval(p);},1+e,schwarz,polmin,undefined,10**(-2),undefined,'function value');//undefined,10**(-6),undefined,1000);
            //console.log("found pequat");
        }
        if (x > .99) { return pequat; }
        let S = new Polynomial(SepPoly(a, e, x));
        //console.log(pequat,S.eval(pequat),ppol,S.eval(ppol),Spol.eval(ppol));
        //if(S.eval(pequat)*S.eval(ppol)>=0){console.log(a,e,x);}
        return brentmethod(function (p) { return S.eval(p); }, pequat, ppol, undefined, toler);//newtonraphson(function(p){return S.eval(p);},pequat,ppol,(pequat+ppol)/2,undefined,10**(-2),undefined,'function value');//undefined,10**(-6),undefined,1000);
    }
    if (x < 0) {
        let S = new Polynomial(SepPoly(a, e, x));
        return brentmethod(function (p) { return S.eval(p); }, ppol, 12, undefined, 10 ** (-3));//newtonraphson(function(p){return S.eval(p);},ppol,12,schwarz,undefined,10**(-2),undefined,'function value');//undefined,10**(-6),undefined,1000);
    }
}




