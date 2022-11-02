var Integrator={
	// Predefined butcher tableaus for the common Runge-Kutta method (fourth order), Heun method (second order), and Euler method (first order).
	predefinedButcher : {
		 rk4: {
			 s: 4,
			 A: [
				 [ 0,  0,  0, 0],
				 [0.5, 0,  0, 0],
				 [ 0, 0.5, 0, 0],
				 [ 0,  0,  1, 0]
			 ],
			 b: [1.0 / 6.0, 1.0 / 3.0, 1.0 / 3.0, 1.0 / 6.0],
			 c: [0, 0.5, 0.5, 1]
		 },
		 heun: {
			 s: 2,
			 A: [
				 [0, 0],
				 [1, 0]
			 ],
			 b: [0.5, 0.5],
			 c: [0, 1]
		 },
		 euler: {
			 s: 1,
			 A: [
				 [0]
			 ],
			 b: [1],
			 c: [0]
		 }
	},
	 
	rungeKutta: function (butcher='rk4', x0, I=[0], N=null, f, dz, [eventbool=false, eventexp,terminalevent=0,optvar], Nmax=N) {
		/** Integration steps continue to be taken until either N steps are taken, the end of the interval I=[begin, end] is reached, or a terminal event occurs, whichever comes first. If N==null (default), then integration will continue until the end of the interval, I=[begin,end], is reached. If I=[begin] (is a one-element array, rather than two), then N steps will be taken (Default is I=[0]). If neither N nor I[1] are given, then a value for Nmax is required, even if a terminal event is set. 

			dz:			float. value is given to h (integration step size). If both N and I[1] are given, then h is calulated and dz is ignored.
			eventbool:              boolean (false). If true, then the function eventexp will be called at the end of each integration step. 
			eventexp:	(x,result[i],optvar). a function that takes two arrays, current step and previous step, and returns a value. It can also be used to act on x.
						An event is detected if the value=0. 
			optvar: This is an optional argument the user can use to control the output of eventexp. 
						"threesteps" - if the string 'threesteps' is given for optvar, then the third argument will be result[i-1] (two steps from current step). Note that for the first integration step, this evaluates to ( x1, x0, undefined ). 
						"duration" - if the string 'duration' is given, the third argument will be the accumulated Delta z (z-z0 or i*dz).
		    terminalevent:	integer value. 
						If eventbool is true, the integration will terminate after this number of events has been detected and counted.
						If a non-positive value is given (default), then integration will continue as normal, but eventexp will still be called each step //options for arrays of event counters will come in a future update
		 
			Nmax:		Positive integer. Emergency shut-off in case of never-ending integration. 
						Reports to the console if the number of steps taken exceeds this number and ends the integration.
			
		**/
		//console.log(typeof(dz));//throw new Error('Stop');
	    var e, j, k, l, s,
		Nnotgiven=(N===null),
		x = [],
		y = [],
		h = (I[1]==undefined || Nnotgiven) ? dz : (I[1] - I[0]) / N,
		t = I[0],t0=t,
		tend= Nnotgiven ? I[1] : t0+N*h,
		dim = x0.length,
		result = [],
		r = 0,
		eventcount=0,
		eventterminationonly=false,
		opt=optvar;
	    if(!tend){eventterminationonly=true;
				/**if(!eventbool || terminalevent<1)
				{	console.log('tend='+tend+' h='+h+' I[1]='+I[1]+' and N='+N)
					throw new Error('No end time or termination point given for the integration.')}**/
				if(Nmax===null){
					console.log('(butcher, x0, I=',I,', N=',N,', f, dz=',dz,', eventbool=',eventbool,', [eventexp,terminalevent=0,direction]=[',eventexp,terminalevent,direction,'], Nmax=',Nmax,')');
				    throw new Error('Please give a value for Nmax.')}
		      //tend=t0+h;
			}
		
		//if (Object.isString(butcher)) {
			butcher = Integrator.predefinedButcher[butcher] || Integrator.predefinedButcher.euler;
		//}
		s = butcher.s;
		 
		// don't change x0, so copy it
		for (e = 0; e < dim; e++) {
			x[e] = x0[e];
		}
		 
		do {// Optimization doesn't work for ODEs plotted using time
			//        if((i % quotient == 0) || (i == N-1)) {
			result[r] = [];
			for (e = 0; e < dim; e++) {
				result[r][e] = x[e];
			}
						
			k = [];
			for (j = 0; j < s; j++) {
				// init y = 0
				for (e = 0; e < dim; e++) {
					y[e] = 0.0;
				}
		 
		 
				// Calculate linear combination of former k's and save it in y
				for (l = 0; l < j; l++) {
					for (e = 0; e < dim; e++) {
						y[e] += (butcher.A[j][l]) * h * k[l][e];
					}
				}
		 
				// add x(t) to y
				for (e = 0; e < dim; e++) {
					y[e] += x[e];
				}
		 
				// calculate new k and add it to the k matrix
				k.push(f(t + butcher.c[j] * h, y));
			}
		 
			// init y = 0
			for (e = 0; e < dim; e++) {
				y[e] = 0.0;
			}
		 
			for (l = 0; l < s; l++) {
				for (e = 0; e < dim; e++) {
					y[e] += butcher.b[l] * k[l][e];
				}
			}
		 
			for (e = 0; e < dim; e++) {
				x[e] = x[e] + h * y[e];
			}
		    //This x is appended to result at the beginning of the next iteration.
		    t += h;
		    
		    if(eventbool){
			if(optvar=='threesteps'){opt=result[r-1];}//result[-1] returns undefined, which is the default vaule for optvar
			if(optvar=='duration'){opt=t-t0;}
			if(eventexp(x,result[r],opt)==0){eventcount++;}
			if(terminalevent>0 && eventcount==terminalevent){break;}//the purpose of detecting the event may be to avoid including it in the result, so terminate here.
		    }
		    r++;
			if(eventterminationonly){tend=t+h;}
			if(r>Nmax+1){console.log('Nmax was exceeded.');break}
		}while(t<=tend)
	    //if(eventbool&&terminalevent<=0){console.log('Event count:',eventcount);}// if eventbool=true, but no termination event is given, it may be because the user wants to see the count.
		return result;
	}
 }
