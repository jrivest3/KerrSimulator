// Because mods should always be in the range 0 <= x < m
function fmod(x, m) {
    return ((x < 0) ? Math.abs(m) : 0) + (x % m);
};
/*
//Object Form
const GeodCont = {
    ctrlbrd: JXG.JSXGraph.initBoard('sepbox', {boundingbox:[0,1.2,13,-0.1], axis:true}),
    spin: ctrlbrd.create('slider',[[1,1.15],[9,1.15],[0,0.9,.99]],{name:'spin'}),
    inc: ctrlbrd.create('slider',[[1,1.05],[9,1.05],[-1,0,1]],{name:'inclination'}),
    point: brd.create('point',[9,.5]),
    
    state:{
    a:(function(){spin.Value() })()
    x:inc.Value(),
    p:point.X(),
        e: point.Y(),
        set update(){}
    },
    SepCurve: new SepController(spin.Value(),inc.Value()),
    
    line: SepCurve.draw(),

    
    dispbrdL: ,
    Geodesic:{
        p: point.X(),
        e: point.Y(),
        a: .a.Value(),//needs to update
        x: ,
        set orbelems(){
            this.p=this.point.X();
            this.e=point.Y();
            this.a=SepCurve.spin;
            this.x=SepCurve.inc;
        }
        
        mu: -1,
        En : 0.935179,
        Lz : 2.37176,
        Q : 3.82514,
        set Constants(p,a,e,x){let p=this.p,a=this.a,e=this.e,x=this.x;
                               const G = 1, M = 1, c = 1;
                               
                               let zm=  Math.sqrt(1 - x**2);
                               
                               function r1(p){return p/(1 - e);}
                               function r2(p){return p/(1 + e);}
                               function Delta1(p){return r1(p)**2 - 2* r1(p) + a**2;}
                               function Delta2(p){return r2(p)**2 - 2* r2(p) + a**2;}
                               
                               
                               let g1,d1,h1,f1,g2,d2,h2,f2;
                               //function dfghSetter(p){
                               let r=r1(p);let rr=r2(p);let Del1=Delta1(p);let Del2=Delta2(p);
                               d1= (r**2 + a**2 * zm**2)* Del1;
                               d2= (rr**2 + a**2 * zm**2)* Del2;
                               f1= r**4 + a**2 *(r *(r + 2) + zm**2 * Del1);
                               f2= rr**4 + a**2 *(rr *(rr + 2) + zm**2 * Del2);
                               g1= 2* a* r;
                               g2= 2* a* rr;
                               h1= r*(r - 2) + zm**2/(1 - zm**2)*Del1;
                               h2= rr*(rr - 2) + zm**2/(1 - zm**2)*Del2;
                               //}
                               
                               
                               //function consSetter(p){
                               let Kappa = d1* h2 - h1* d2;
                               let Epsilon = d1* g2 - g1* d2;
                               let Rho = f1* h2 - h1* f2;
                               let Eta = f1* g2 - g1* f2;
                               let Sigma = g1* h2 - h1* g2;

                               this.En= Math.sqrt((Kappa * Rho + 2* Epsilon * Sigma - x * 2* Math.sqrt(Sigma * (Sigma * Epsilon**2 + Rho * Epsilon * Kappa - Eta * Kappa**2)/x**2))/(Rho**2 + 4* Eta * Sigma))
                               
                               this.Lz= (-En*g1 + x*Math.sqrt((-d1*h1 + En**2 *(g1**2 + f1*h1))/x**2))/h1
                               
                               this.Q= zm**2 *(a**2 * (1 - En**2) + Lz**2/(1 - zm**2))
                               
                               //}
                               
                               /*    //Bisection needs a function of p. r1 and r2 are left as function of p for this purpose, since they are simple calculations.
                                     function AplusB(p){return (2*M)/(1 - En**2) - (r1(p) + r2(p));}//(*Eq.(11)*) 
                                     function AB(p){return (a**2 *Q)/((1 - En**2) *r1(p) *r2(p));}//(*Eq.(11)*)
                                     function r3(p) {return (AplusB(p) + Math.sqrt(AplusB(p)**2 - 4*AB(p)))/2;}//(*Eq.(11)*)
                                     function r4(p) {return AB(p)/r3(p);}
                               */
/*                              }
    },
    
    
    set updateSpin(){a.on('drag',function(){SepCurve.spin=a.Value();SepCurve.updateGraph();SepCurve.updateDisplay();});},
    set updateInc(){x.on('drag',function(){SepCurve.inc=x.Value();SepCurve.updateGraph();SepCurve.updateDisplay();});}
}*/

///Constructor Form
class GeodCont {
    constructor() {
        const that = this; //Something to help keep track of what 'this' is. 

        this.ctrlbrd = JXG.JSXGraph.initBoard('sepbox', { boundingbox: [0, 1.2, 22, -0.1], axis: false });
        this.xaxis = this.ctrlbrd.create('axis', [[0, 0], [1, 0]],
            {
                name: 'p',
                withLabel: true,
                label: {
                    position: 'rt',  // possible values are 'lft', 'rt', 'top', 'bot'
                    offset: [-4, 13],   // (in pixels)
                    fontSize: 16
                }
            });

        this.yaxis = this.ctrlbrd.create('axis', [[0, 0], [0, 1]],
            {
                name: 'e',
                withLabel: true,
                label: {
                    position: 'rt',  // possible values are 'lft', 'rt', 'top', 'bot'
                    offset: [5, -57],   // (in pixels)
                    fontSize: 16
                    //fontStyle: 'bold' //how to I make it bold?
                }
            });
        this.spin = this.ctrlbrd.create('slider', [[.8, 1.15], [17, 1.15], [0, 0, .99]], { name: 'spin' });
        this.inc = this.ctrlbrd.create('slider', [[.8, 1.05], [17, 1.05], [-1, -1, 1]], { name: 'inclination', snapWidth: .01 });

        this.SepCurve = new SepController(this.ctrlbrd);
        const SepCurve = that.SepCurve;
        SepCurve.updateGraph(this.spin.Value(), this.inc.Value()); SepCurve.updateDisplay();
        //that.point.attractors[0]=SepCurve.curve;
        this.userpoint = this.ctrlbrd.create('point', [9, .5]);
        this.userpoint.setAttribute({
            hasLabel: true, label: {
                offset: [0, 10],
                anchorX: 'middle',
                anchorY: 'bottom',
            },
            snapToGrid: true,
            snapSizeX: .01, snapSizeY: .01
        }); //,hasLabel=false,snaptoPoints=true,attractorDistance=24,snatchDistance=210
        this.userpoint.setLabelText('(Drag the red dot)');

        this.ctrlbrd.on('update', function () {
            var o;
            if (typeof that.ctrlbrd.touches != 'undefined' && that.ctrlbrd.touches.length > 0) {
                o = that.ctrlbrd.touches[0].obj;
            } else if (that.ctrlbrd.mouse != null && typeof that.ctrlbrd.mouse.obj != 'undefined') {
                o = that.ctrlbrd.mouse.obj;
            } else {
                return;
            }

            // if (o==that.SepBarrier) {
            //     that.SepBarrier.position = that.SepBarrier.position - 0.3;
            //     that.SepBarrier.prepareUpdate().update(true).updateRenderer();

            //     that.SepBarrier.setPositionDirectly(JXG.COORDS_BY_USER, [A.X()+3, C.Y()]); 
            //     that.SepBarrier.prepareUpdate().update().updateRenderer();
            // } else
            if (document.getElementById('MatchFreqQ').checked && o == that.userpoint) {
                //   that.userpoint.position = that.userpoint.position + 0.3;
                //  that.userpoint.prepareUpdate().update(true).updateRenderer();

                that.userpoint.setPositionDirectly(JXG.COORDS_BY_USER, [ResCurve.findResSurface(state.a, that.userpoint.Y(), state.x), that.userpoint.Y()]);
                that.userpoint.prepareUpdate().update().updateRenderer();
            }
            // else if (o==C) {
            //   A.setPositionDirectly(JXG.COORDS_BY_USER, [C.X()-3, A.Y()]); 
            //   A.prepareUpdate().update().updateRenderer();

            //   B.position = A.position - 0.3;
            //   B.prepareUpdate().update(true).updateRenderer();
            // } 
        });

        // Make better names for everything
        // stuff for running animation
        //integrator proper time stepsize.
        let dtau = 0.05; //This value is for the initialization of the controller, and will be adjusted by the user.

        //B-L time per frame.
        let delT = 1; //This value is for the initialization of the controller, and will be adjusted by the user.
        this.historyPoints = document.getElementById("histslide").value;
        this.historyLength = delT * this.historyPoints; //how long the idisplayed solution should be. This is now a BL time interval.
        let tickTime = 35; // in milliseconds.//This value is for the initialization of the controller, and will be adjustable for the user.
        let timeoutID;
        let playingstate = false;
        let showZAMO = false; //Zero Angular Momentum Observers
        let FixedCamera = true; //Camera position is the default starting location.
        let FixedTarget = true; //Camera target is the origin, rather than the end of the trajectory.
        let ZAMOcam = false; // Camera orbits along the path of a ZAMO at it's current r and theta position.
        let followingdistance = 5; // Initial trailing distance for the orbiting camera behind the orbiting target. (number of integration steps along the tragectory) Adjustable by user.
        let Corotating_Frame_Traj_On = false; //Draw a green trajectory showing the apparent path seen in a reference frame that co-rotates with the camera. (Camera2 must be motionless for proper trajectory to be shown.)
        //this.RefFrame_Omega = 0;
        let FermiWalkerCoords = false; //not implemented //convert entire scene into Fermi-Walker coordinates of the camera position. (Camera still targets the BH)


        this.state = {
            get a() { return that.spin.Value() },
            get x() { return that.inc.Value() },
            get p() { return that.userpoint.X() },
            get e() { return that.userpoint.Y() },
            //set update(){}
        };
        const state = that.state;

        this.spin.on('drag', function () {
            updateEH(this.Value());
            updateErgo(this.Value());
            that.ZAMOGrid.updateOmegas(this.Value());
            //SepCurve.spin=that.spin.Value();
            SepCurve.updateGraph(this.Value(), state.x); SepCurve.updateDisplay();
            const pmin = findSeparatrix(this.Value(), state.e, state.x);
            if (that.userpoint.X() <= pmin + 0.1 //that.SepBarrier.X()
            ) {
                that.userpoint.moveTo([pmin + 0.1, that.userpoint.Y()]); //that.SepBarrier.X() + 0.2;
            }
            //that.SepBarrier.moveTo([that.SepBarrier.X(),that.SepBarrier.Y()]);
            //if(that.SepBarrier.crossedQ(that.userpoint)){that.userpoint.moveTo([that.SepBarrier.X() + 0.2, that.userpoint.Y()]);}
            //that.point.attractors[0]=SepCurve.curve;
            if (this.Value() == 0) {
                document.getElementById('RatioMenu').options[2].innerHTML = '&Omega;<sub>&theta;</sub>/&Omega;<sub>&phi;</sub> =1';
                document.getElementById('RatioMenu').options[2].disabled = true;
            }//the theta/phi ratio is 1 if a==0
            else if (document.getElementById('RatioMenu').options[2].disabled) {
                document.getElementById('RatioMenu').options[2].innerHTML = '&Omega;<sub>&theta;</sub>/&Omega;<sub>&phi;</sub>';
                document.getElementById('RatioMenu').options[2].disabled = false;
            }
            if (ResCurveOn) {
                if (ResGlider) { that.userpoint.free(); }
                //ResCurve.spin=that.spin.Value();
                ResCurve.updateGraph(this.Value(), state.x);//,...that.Geodesic.ParamArray)
                ResCurve.updateDisplay();
                if (ResGlider) {
                    //if(document.getElementById('MatchFreqQ').checked)
                    that.userpoint.moveTo([ResCurve.findResSurface(this.Value(), state.e, state.x), that.userpoint.Y()]);
                    that.userpoint.makeGlider(ResCurve.curve); that.ctrlbrd.update();
                }
            }
            that.GeodesicReConstructor(state.p, this.Value(), state.e, state.x, dtau);
        });
        this.inc.on('drag', function () {
            //SepCurve.inc=this.Value();
            SepCurve.updateGraph(state.a, this.Value());//,...that.Geodesic.ParamArray); 
            SepCurve.updateDisplay();
            const pmin = findSeparatrix(state.a, state.e, this.Value());
            if (that.userpoint.X() <= pmin + .1 //that.SepBarrier.X()
            ) {
                that.userpoint.moveTo([pmin + 0.1, that.userpoint.Y()]); //that.SepBarrier.X() + 0.2;
            }
            //that.SepBarrier.moveTo([that.SepBarrier.X(),that.SepBarrier.Y()]);
            //if(that.SepBarrier.crossedQ(that.userpoint)){that.userpoint.moveTo([that.SepBarrier.X() + 0.2, that.userpoint.Y()]);}
            //that.point.attractors[0]=SepCurve.curve;
            if (this.Value() == 0) {//Omega_phi is Indeterminate at x=0
                document.getElementById('RatioMenu').options[1].innerHTML = '&Omega;<sub>&phi;</sub>=NaN';
                document.getElementById('RatioMenu').options[1].disabled = true;
                document.getElementById('RatioMenu').options[2].innerHTML = '&Omega;<sub>&phi;</sub>=NaN';
                document.getElementById('RatioMenu').options[2].disabled = true;
            }
            else if (document.getElementById('RatioMenu').options[1].disabled) {
                document.getElementById('RatioMenu').options[1].innerHTML = '&Omega;<sub>r</sub>/&Omega;<sub>&phi;</sub>';
                document.getElementById('RatioMenu').options[1].disabled = false;
                document.getElementById('RatioMenu').options[2].innerHTML = '&Omega;<sub>&theta;</sub>/&Omega;<sub>&phi;</sub>';
                document.getElementById('RatioMenu').options[2].disabled = false;
            }
            if (ResCurveOn) {
                if (ResGlider) { that.userpoint.free(); }
                //ResCurve.spin=that.spin.Value();
                ResCurve.updateGraph(state.a, this.Value());//,...that.Geodesic.ParamArray);
                ResCurve.updateDisplay();
                if (ResGlider) {
                    that.userpoint.moveTo([ResCurve.findResSurface(state.a, state.e, this.Value()), that.userpoint.Y()]);
                    that.userpoint.makeGlider(ResCurve.curve); that.ctrlbrd.update();
                }
            }
            that.GeodesicReConstructor(that.userpoint.X(), state.a, state.e, this.Value(), dtau);
        });
        this.userpoint.on('drag',
            //console.log(state.p,state.e)
            function () {
                var curp = this.X(), cure = this.Y(), passedbarrier = false;
                if (cure >= 0.99) {
                    passedbarrier = true; cure = 0.99;
                }
                else if (cure <= 0.) {
                    passedbarrier = true; cure = 0.;
                }
                const pmin = findSeparatrix(state.a, cure, state.x);
                //that.SepBarrier.moveTo([that.SepBarrier.X(),cure]);
                if (curp <= pmin + .1 //that.SepBarrier.X()
                ) {
                    passedbarrier = true; curp = pmin + 0.1; //that.SepBarrier.X() + 0.2;
                }
                if (passedbarrier) {
                    that.userpoint.moveTo([curp, cure]);
                }

                that.GeodesicReConstructor(state.p, state.a, state.e, state.x, dtau);
                that.zoom.setMax(that.Geodesic.r2 * 4);
                that.zoom.setValue(that.Geodesic.r2 * 3);
                that.dispbrdL.camera.position.set(6, 5, that.zoom.Value());
            });



        //Left Camera
        this.dispbrdL = THREE.Bootstrap({
            element: document.querySelector('#animbox'),
            plugins: ['core', 'controls', 'cursor'],
            controls: {
                klass: THREE.OrbitControls
            },
        });
        //Right Camera
        this.dispbrdR = THREE.Bootstrap({
            element: document.querySelector('#animbox2'),
            plugins: ['core', 'controls', 'cursor'],
            controls: {
                klass: THREE.OrbitControls
            },
        });

        this.dispbrdL.scene.add(new THREE.AmbientLight(0xf0f0f0));
        this.dispbrdR.scene = this.dispbrdL.scene; // Both renderers view the same scene.

        this.helper = new THREE.GridHelper(60, 5);
        let helper = this.helper;
        helper.position.y = -6;
        helper.material.opacity = 0.25;
        helper.material.transparent = true;
        that.dispbrdL.scene.add(helper);

        const renderer = that.dispbrdL.renderer;
        const renderer2 = that.dispbrdR.renderer;
        renderer.setClearColor(0xf0f0f0);
        renderer2.setClearColor(0xf0f0f0);
        // Alter controls
        that.dispbrdL.controls.rotateSpeed = 0.5;
        that.dispbrdR.controls.rotateSpeed = 0.5;
        // Place camera	
        // const BOX_WIDTH= document.getElementById('animbox').clientWidth;
        // const BOX_HEIGHT= document.getElementById('animbox').clientHeight;
        // const aspect = BOX_WIDTH / BOX_HEIGHT;
        this.zoom = this.ctrlbrd.create('slider', [[1, 0.075], [15, 0.075], [0, 3 * state.p / (1 - state.e), 10 * state.p / (1 - state.e)]], { name: 'zoom' });
        this.zoom.on('drag', function () {
            that.dispbrdL.camera.position.set(6, 5, that.zoom.Value());
        });
        that.dispbrdL.camera.position.set(-36, 25, that.zoom.Value());
        // that.dispbrdL.camera.aspect=.5*aspect;
        // that.dispbrdL.camera.updateProjectionMatrix();
        //Secondary camera
        this.dispbrdR.camera.position.set(-10, -17, that.zoom.Value());

        // Green dot showing the location of camera 2 for camera 1 to see.
        //var tex = new THREE.TextureLoader().load("https://threejs.org/examples/textures/sprites/disc.png",crossorigin="anonymous");
        //var dotGeometry = new THREE.SphereGeometry(new THREE.Vector3(),1);
        var dotGeometry = new THREE.Geometry();
        dotGeometry.vertices.push(new THREE.Vector3());
        var dotMaterial = new THREE.PointsMaterial({ size: .5, sizeAttenuation: true, color: 0x00cc99 });
        this.dispbrdR.camera.Dot = new THREE.Points(dotGeometry, dotMaterial);
        this.dispbrdR.camera.Dot.position.copy(this.dispbrdR.camera.position);
        this.dispbrdL.scene.add(this.dispbrdR.camera.Dot);
        let doton = true;
        //Dot for Camera 1
        var dotGeometry1 = new THREE.Geometry();
        dotGeometry1.vertices.push(new THREE.Vector3());
        var dotMaterial1 = new THREE.PointsMaterial({ size: .5, sizeAttenuation: true, color: 0xffa812 });
        this.dispbrdL.camera.Dot = new THREE.Points(dotGeometry1, dotMaterial1);
        this.dispbrdL.camera.Dot.position.copy(this.dispbrdL.camera.position);
        this.dispbrdL.scene.add(this.dispbrdL.camera.Dot);

        var updatecameras = function () {
            that.dispbrdR.camera.Dot.position.copy(that.dispbrdR.camera.position);
            that.dispbrdL.camera.Dot.position.copy(that.dispbrdL.camera.position);
            that.dispbrdR.camera.Omega = that.Omega(state.a, that.find_rBL(Cam2Pos.length(), Cam2Pos.y, state.a), Cam2Pos.y);
        };
        document.getElementById("animbox").addEventListener("mouseover", updatecameras);
        document.getElementById("animbox2").addEventListener("mouseover", updatecameras);
        document.getElementById("animbox").addEventListener("click", updatecameras);
        document.getElementById("animbox2").addEventListener("click", updatecameras);
        document.getElementById("animbox").addEventListener("drag", updatecameras);
        document.getElementById("animbox2").addEventListener("drag", updatecameras);
        //document.getElementById("animbox").addEventListener("scroll", updatecameras);
        //document.getElementById("animbox2").addEventListener("scroll", updatecameras);
        document.getElementById("playpause").addEventListener("click", updatecameras);
        document.getElementById("cameraSwitcher").addEventListener("change", updatecameras);
        //document.getElementById("Corotate").addEventListener("click", updatecameras);
        //document.getElementById("frameSwitcher").addEventListener("change", updatecameras);

        const G = 1, M = 1, c = 1;

        //For a given point with a Cartesion radius and polar angle, there is a unique BL ellipse inerstecting that point at r_BL and theta_BL.
        this.find_rBL = function (r_cart, z, a) {
            if (r_cart == 0) { return 0; }
            const answer = Math.sqrt((r_cart * r_cart - a * a + Math.sqrt(a * a * a * a + r_cart * r_cart * r_cart * r_cart - 2 * a * a * (r_cart * r_cart - 2 * z * z))) / 2);
            if (isNaN(answer)) { throw new Error('rBL is' + answer); }
            return answer;
        };
        //frame dragging rate in radians/sec in BL time
        this.Omega = function (a, circle_r, circle_z) {
            const cosine = circle_z / circle_r; //If r is BL,then theta will be BL, because z is just z.

            //const Sigma = circle_r**2 + a*a * cosine*cosine;
            const Delta = circle_r * circle_r - 2 * M * circle_r + a * a;
            const sinsq = 1 - cosine * cosine;
            const numerator = (2 * G * M) * circle_r * a; //Wikipedia has c in the numerator and no c's in the denominator. But c=1, so...

            //const denom = c*Sigma*(circle_r*circle_r+a*a)+(2*G*M/c)*circle_r*a*a*sinsq;
            const denom = (circle_r * circle_r + a * a) * (circle_r * circle_r + a * a) - a * a * Delta * sinsq;
            return numerator / denom;
        };
        this.LieDrag = function (location, Time) {
            if (state.a == 0) { return; }
            const rBL = that.find_rBL(location.length(), location.y, state.a);
            const rotation = that.Omega(state.a, rBL, location.y) * Time; if (!rotation) { throw new Error('rotation = ' + rotation); }
            let current_x = location.x, current_z = location.z;

            //Trig identities 
            const sinph = Math.sin(rotation); const cosph = Math.cos(rotation);
            let sin_add = (x, y) => (y * cosph + x * sinph); // Radius is multiplied in.
            let cos_add = (x, y) => (x * cosph - y * sinph);

            //The camera's position is in Cartesian coords, but Omega is in BLT coords.
            //Delta y 
            location.x = sin_add(current_z, current_x, rotation); if (isNaN(location.x)) { throw new Error('x = ' + location.x); }
            //Delta x 
            location.z = cos_add(current_z, current_x, rotation); if (isNaN(location.z)) { throw new Error('z = ' + location.z); }
            // let new_location;
            // return new_location
        };

        let Cam2Pos = this.dispbrdR.camera.position;
        this.dispbrdR.camera.Omega = this.Omega(state.a, that.find_rBL(Cam2Pos.length(), Cam2Pos.y, state.a), Cam2Pos.y);

        this.GeodesicReConstructor = function (p, a, e, x, taustep) {
            document.getElementById("BLtime").innerHTML = that.historyLength;
            document.getElementById("ptime:2").innerHTML = 0;

            if (that.Geodesic != undefined) {
                that.dispbrdL.scene.remove(that.Geodesic.traj.object);
                that.Geodesic.traj.object.geometry.dispose();
                delete that.Geodesic;
            }

            function Delta(r) {
                return r * r - 2 * r + a * a;
            }
            function Sigma(r, usq) {
                return r * r + a * a * usq;
            } //usq=cos(theta)^2
            that.Geodesic = {
                mu: -1,
                En: 0.935179,
                Lz: 2.37176,
                Q: 3.82514,

                zm: Math.sqrt(1 - x * x),
                zp: 1.1,
                r1: p / (1 - e),
                r2: p / (1 + e),
                r3: 7.0,
                r4: 8.0,

                _CoMs: [0, 0, 0], //[this.En,this.Lz,this.Q],
                _RadialRoots: [0, 0, 0, 0], //[this.r1,this.r2,this.r3,this.r4],
                _PolarRoots: [0, 0], //[this.zm,this.zp],
                _ParamArray: [0, 0, 0, 0, 0, 0, 0, 0, 0], //[this.En,this.Lz,this.Q,this.r1,this.r2,this.r3,this.r4,this.zm,this.zp],
                get CoMs() { return this._CoMs },
                get RadialRoots() { return this._RadialRoots },
                get PolarRoots() { return this._PolarRoots },
                get ParamArray() { return this._ParamArray },
                set CoMs(arr) { this._CoMs = arr; },
                set RadialRoots(arr) { this._RadialRoots = arr; },
                set PolarRoots(arr) { this._PolarRoots = arr; },
                set ParamArray(arr) { this._ParamArray = arr; },

                set Constants([p, a, e, x]) {
                    let zm = this.zm, r1 = this.r1, r2 = this.r2;
                    ///Special case functions defined in KerrB
                    this.En = KerrGeoEnergy(a, p, e, x);
                    this.Lz = KerrGeoAngularMomentum(a, p, e, x, this.En);
                    this.Q = KerrGeoCarterConstant(a, p, e, x, this.En, this.L);


                    /// these will return 'undefined' if no special cases apply.
                    if (this.Q == undefined) {

                        //Set Constants of Motion
                        let Del1 = Delta(r1); let Del2 = Delta(r2);
                        let d1 = (r1 ** 2 + a ** 2 * zm ** 2) * Del1;
                        let d2 = (r2 ** 2 + a ** 2 * zm ** 2) * Del2;
                        let f1 = r1 ** 4 + a ** 2 * (r1 * (r1 + 2) + zm ** 2 * Del1);
                        let f2 = r2 ** 4 + a ** 2 * (r2 * (r2 + 2) + zm ** 2 * Del2);
                        let g1 = 2 * a * r1;
                        let g2 = 2 * a * r2;
                        let h1 = r1 * (r1 - 2) + zm ** 2 / (1 - zm ** 2) * Del1;
                        let h2 = r2 * (r2 - 2) + zm ** 2 / (1 - zm ** 2) * Del2;
                        let Kappa = d1 * h2 - h1 * d2;
                        let Epsilon = d1 * g2 - g1 * d2;
                        let Rho = f1 * h2 - h1 * f2;
                        let Eta = f1 * g2 - g1 * f2;
                        let Zeta = g1 * h2 - h1 * g2;

                        // En, Lz, and Q belong to Geodesic, not the controller.
                        if (this.En == undefined) {
                            this.En = Math.sqrt((Kappa * Rho + 2 * Epsilon * Zeta - x * 2 * Math.sqrt(Zeta * (Zeta * Epsilon ** 2 + Rho * Epsilon * Kappa - Eta * Kappa ** 2) / x ** 2)) / (Rho ** 2 + 4 * Eta * Zeta));
                        }
                        if (this.Lz == undefined) {
                            this.Lz = (0 - this.En * g1 + x * Math.sqrt((-d1 * h1 + this.En ** 2 * (g1 ** 2 + f1 * h1)) / x ** 2)) / h1;
                        }
                        this.Q = zm ** 2 * (a ** 2 * (1 - this.En ** 2) + this.Lz ** 2 / (1 - zm ** 2));
                    }
                    //console.log('E='+this.En+' Lz='+this.Lz+' Q='+this.Q);
                    document.getElementById("Constants").innerHTML = 'E = ' + this.En + ', Lz = ' + this.Lz + ', Q = ' + this.Q;
                    this.CoMs = [this.En, this.Lz, this.Q];
                },
                set Roots([a, x]) {
                    const AplusB = (2 * M) / (1 - this.En ** 2) - (this.r1 + this.r2), AB = (a ** 2 * this.Q) / ((1 - this.En ** 2) * this.r1 * this.r2);
                    this.r3 = (AplusB + Math.sqrt(AplusB ** 2 - 4 * AB)) / 2; //(*Eq.(11)*)
                    this.r4 = AB / this.r3;
                    this.zp = Math.sqrt(this.Q / (1 - x ** 2));
                    this.RadialRoots = [this.r1, this.r2, this.r3, this.r4];
                    this.PolarRoots = [this.zm, this.zp];
                }
            };

            that.Geodesic.Constants = [p, a, e, x];
            that.Geodesic.Roots = [a, x];
            that.Geodesic.ParamArray = [...that.Geodesic.CoMs, ...that.Geodesic.RadialRoots, ...that.Geodesic.PolarRoots];
            const r1 = that.Geodesic.r1, r2 = that.Geodesic.r2, r3 = that.Geodesic.r3, r4 = that.Geodesic.r4;
            const mu = that.Geodesic.mu, En = that.Geodesic.En, Lz = that.Geodesic.Lz, Q = that.Geodesic.Q;

            that.Geodesic.Frequencies = Frequencies(a, p, e, x, En, Lz, Q, r1, r2, r3, r4);
            document.getElementById("Freq").innerHTML = '&Omega;<sub>r</sub>= ' + that.Geodesic.Frequencies[0].toPrecision(5) + ', &Omega;<sub>&theta;</sub>= ' + that.Geodesic.Frequencies[1].toPrecision(5) + ', &Omega;<sub>&phi;</sub>= ' + that.Geodesic.Frequencies[2].toPrecision(5);

            that.Geodesic.gtdilation = (r, usq) => Math.sqrt(((a * a + r * r) ** 2 - a * a * Delta(r) * (1 - usq)) / (Delta(r) * Sigma(r, usq)));

            // Here is a javascript function to emit a function that computes the
            // RHS of the ODE.
            function makeRHS() {
                //let r1=1,r2=1,mu=1,En=1,Lz=1,Q=1;
                const Phisq = Lz ** 2 / (1 - En ** 2), q = Q / (1 - En ** 2); // is mu^2 1 or -1?
                const U0sq = that.Geodesic.zm ** 2; //((a**2 + q + Phisq) - Math.sqrt((a**2 + q + Phisq)**2 - 4* a**2* q))/(2.* a**2);// this is zm^2, right?
                const asqU1sq = ((a ** 2 + q + Phisq) + Math.sqrt((a ** 2 + q + Phisq) ** 2 - 4 * a ** 2 * q)) / (2.); //* a**2); //u0 and u1 just need to be swapped. now u1^2>1




                //console.log('Phisq=',Phisq,'q=',q,'U0sq=',U0sq,'U1sq=',U1sq);
                //console.log(r3,r4);
                return function (zeta, position) {
                    //const time = position[3]; 

                    const xi = position[0], chi = position[1], phi = position[2];
                    //console.log('position='+[xi,chi,phi]);
                    const r = p / (1 + e * Math.cos(xi)); //r2 +(r1-r2)*Math.cos(xi);
                    const Delt = Delta(r);

                    const sinchi = Math.sin(chi);
                    const sinchisq = sinchi * sinchi;
                    const usq = U0sq * sinchisq;
                    const Sig = Sigma(r, usq);
                    //console.log('r=',r,'Delt=',Delt,'sinchi=',sinchi,'Sig=',Sig);
                    const tdot = (a * (Lz - a * En * (1. - usq)) + (r ** 2 + a ** 2) * ((r ** 2 + a ** 2) * En - Lz * a) / Delt) / Sig;
                    //const Rofr = (En* (r**2 + a**2) - a* Lz)**2 - Delt* (mu**2* r**2 + (Lz - a* En)**2 + Q);
                    const xidot = Math.sqrt((1 - En ** 2) * r1 * r2 * (r - r3) * (r - r4)) / Sig / r; //Math.sqrt((mu**2 - En**2)*Math.cos[xi]*(r - r3)*(r - r4))/Sig;
                    const chidot = Math.sqrt((1 - En ** 2) * (asqU1sq - usq * a ** 2)) / Sig;
                    const phidot = (2. * M * r * a * En + (Sig - 2. * M * r) * Lz / (1. - usq)) / (Delt * Sig);
                    if (isNaN(xidot) || isNaN(chidot) || isNaN(phidot)) {
                        console.log('spin:', a, ' orb elems:', p, e, x, ' consts:', En, Lz, Q, "r's:", r, r3, r4);
                        console.log('position=' + [xi, chi, phi]);
                        console.log('momentum=' + [xidot, chidot, phidot]);
                        console.log(findSeparatrix(a, e, x));
                        throw new Error('got NaNs?');
                    }
                    //console.log('Position='+[xidot,chidot, phidot]);
                    return [xidot, chidot, phidot, tdot];
                };
            };


            that.Geodesic.updateSolution = function (initialconditions, Tinterval, numPoints = null, dz) {
                let initialized = true;
                if (that.Geodesic.currentSolution === undefined) { initialized = false; }
                function eventlocator(pos, prevpos, ztot) {
                    pos[0] = fmod(pos[0], 2. * Math.PI);
                    pos[1] = fmod(pos[1], 2. * Math.PI);
                    pos[2] = fmod(pos[2], 2. * Math.PI);
                    if (x == 0) { // fix discontinuity at the poles, only works because of the axial symmetry
                        // because of the mod 2Pi, only the southward going side of the orbit is off.
                        if ((prevpos[1] < Math.PI / 2 && pos[1] >= Math.PI / 2)
                            || (pos[1] >= 3 * Math.PI / 2 && prevpos[1] < 3 * Math.PI / 2)) { pos[2] += Math.PI; }
                    }

                    //This terminates integration after the specified BL time has passed.
                    if (pos[3] - initialconditions[3] >= Tinterval) // < fmod( prevpos[3] , Tinterval))
                    { //console.log('Tinterval reached',pos[3],initialconditions[3])
                        document.getElementById("ptime:1").innerHTML = ztot.toFixed(3);
                        document.getElementById("ptime:2").innerHTML = (parseFloat(document.getElementById("ptime:2").innerHTML) + ztot).toFixed(3);
                        return 0;
                    }
                    //if(initialized){
                    //console.log('Tinterval ',Tinterval,pos[3]-initialconditions[3])}
                    return pos[3];
                }
                /*let data = JXG.Math.Numerics.rungeKutta(
                    'rk4',                                       // Butcher table
                    initialconditions,//that.Geodesic.currentSolution[that.Geodesic.currentSolution.length - 1], // Initial conditions
                    [0, zetaIntervalLength],                     // zeta interval
                    numZetaPoints,                               // how many points
                    makeRHS()//(zetaIntervalLength, numZetaPoints) // the RHS of the system
                );*/
                let data = Integrator.rungeKutta(
                    'rk4',
                    initialconditions,
                    [0],
                    numPoints,
                    makeRHS(),
                    dz,
                    [true, eventlocator, 1, "duration"],
                    100000
                );

                if (!initialized) { return data; }
                // make the replacement atomic
                let newSolution = that.Geodesic.currentSolution.concat(data);
                newSolution.splice(0, data.length);
                //console.log(data.length);
                that.Geodesic.currentSolution = newSolution; //might need to be that.Geodesic.currentSolution
            };

            that.Geodesic.currentSolution = that.Geodesic.updateSolution([0., 0., 0., 0.], that.historyLength, null, taustep);

            //Only needed if having two trajectories?
            // that.Geodesic.Corotating_Frame=new Object();
            // that.Geodesic.Corotating_Frame.currentSolution=new Array();
            // // too much memory?
            // if(Corotating_Frame_Traj_On){that.Geodesic.Corotating_Frame.currentSolution=that.Geodesic.currentSolution.map((x) => x);}
            that.Geodesic.solutionTo3D = function (solution) {

                const zm = that.Geodesic.zm; //, r1=that.Geodesic.r1, r2=that.Geodesic.r2;//u0(a,r); using zm for now
                let threeVectors = new Array(solution.length);
                //let Corot_threeVectors
                for (let i = 0; i < solution.length; i++) {
                    let xi = solution[i][0], chi = solution[i][1], phi = solution[i][2];
                    let r = p / (1 + e * Math.cos(xi)); //r2 +(r1-r2)*Math.cos(xi);
                    let xyR = Math.sqrt(r * r + a * a); // BL coords to cartesian
                    let u = zm * Math.sin(chi); //u=cos(theta)
                    let cou = Math.sqrt(1. - u * u); //=sin(theta)





                    // REMINDER: computer graphics people have a (different) convention for
                    // their coordinate system. For them, z is out of the
                    // screen. I want the default controls to work well, so I rotate
                    // my threeVectors to work with their coordinate system.
                    if (Corotating_Frame_Traj_On && document.getElementById("cameraSwitcher").value == "fixed") { //make sure it is off when ZAMOcam is off
                        let t = solution[i][3];
                        let Deltaphi = that.RefFrame_Omega * t;
                        threeVectors[i] = new THREE.Vector3(
                            xyR * cou * Math.sin(phi - Deltaphi),
                            r * u,
                            xyR * cou * Math.cos(phi - Deltaphi)); //x
                    } else {
                        threeVectors[i] = new THREE.Vector3(
                            xyR * cou * Math.sin(phi),
                            r * u,
                            xyR * cou * Math.cos(phi)); //x
                    }
                    // threeVectors[i] = new THREE.Vector3(
                    //     xyR * cou * Math.sin(phi),//y
                    //     r * u,//z
                    //     xyR * cou * Math.cos(phi));//x
                    // if(ZAMOcam && Corotating_Frame_Traj_On){
                    //     // let Deltaphi_per_T=;
                    //     // let Deltaphi=
                    //     different_threeVectors[i] = new THREE.Vector3(
                    //     xyR * cou * Math.sin(phi),//y
                    //     r * u,//z
                    //     xyR * cou * Math.cos(phi));//x
                    // } 
                }

                return threeVectors;
            };

            that.Geodesic.traj = (function initTraj() {
                const it = new Object;
                it.material = new THREE.LineBasicMaterial({
                    color: 0xff0000,
                    linewidth: 2
                });
                if (Corotating_Frame_Traj_On && document.getElementById("cameraSwitcher").value == "fixed") { it.material.color = 0x00db00; }
                const trajGeom = new THREE.Geometry();
                const threeVectors = that.Geodesic.solutionTo3D(that.Geodesic.currentSolution);
                trajGeom.vertices = threeVectors;
                // Create the new Object3d to add to the scene
                it.object = new THREE.Line(trajGeom, it.material);

                that.dispbrdL.scene.add(it.object);
                return it;
            })();
            //let traj=that.Geodesic.traj;
            that.Geodesic.updateTrajGeom = function (solution) {
                const threeVectors = that.Geodesic.solutionTo3D(solution);

                const newGeom = new THREE.Geometry();
                newGeom.vertices = threeVectors;

                that.Geodesic.traj.object.geometry.dispose();
                that.Geodesic.traj.object.geometry = newGeom;

            };
        };
        this.GeodesicReConstructor(state.p, state.a, state.e, state.x, dtau);


        this.eventhorizon = (function initEH(a) {
            const eh = new Object;
            eh.material = new THREE.MeshBasicMaterial({ color: 0x000000 });
            eh.material.opacity = 0.5;
            eh.material.transparent = true;
            eh.haveScaled = false;

            const rplus = 1. + Math.sqrt(1. - a * a); // M+Sqrt(M^2+a^2)

            //const ehGeom = new THREE.SphereGeometry( rplus , 32, 32 );
            const xyR = Math.sqrt(rplus * rplus + a * a);
            const ehGeom = new THREE.SphereGeometry(1, 32, 32);
            ehGeom.scale(xyR, rplus, xyR);
            const newEhMesh = new THREE.Mesh(ehGeom, eh.material);


            // Remember the ridiculous coord system
            const dir = new THREE.Vector3(0., 1., 0.);
            const origin = new THREE.Vector3(0., rplus, 0.);
            const length = 0.75;
            const hexColor = 0x0000ff;
            const newArrowHelper = new THREE.ArrowHelper(dir, origin, length,
                hexColor);

            newArrowHelper.line.material.linewidth = 3;
            newArrowHelper.cone.geometry.scale(5, 1, 5); // why this needs to happen only once? No idea...

            that.dispbrdL.scene.add(newEhMesh);
            that.dispbrdL.scene.add(newArrowHelper);

            eh.mesh = newEhMesh;
            eh.arrowhelper = newArrowHelper;

            return eh;

        })(this.state.a);


        function updateEH(a) {
            const rplus = 1. + Math.sqrt(1. - a * a);
            const xyR = Math.sqrt(rplus * rplus + a * a);
            const ehGeom = new THREE.SphereGeometry(1, 32, 32);

            ehGeom.scale(xyR, rplus, xyR);
            const eh = that.eventhorizon;
            eh.mesh.geometry.dispose();
            eh.mesh.geometry = ehGeom;

            //ergo
            // Remember the ridiculous coord system
            const dir = new THREE.Vector3(0., 1., 0.);
            const origin = new THREE.Vector3(0., rplus, 0.);
            const length = 0.75;
            const hexColor = 0x0000ff;
            const newArrowHelper = new THREE.ArrowHelper(dir, origin, length,
                hexColor);

            newArrowHelper.line.material.linewidth = 3;

            that.dispbrdL.scene.remove(eh.arrowhelper);
            eh.arrowhelper.line.geometry.dispose();
            eh.arrowhelper.line.material.dispose();
            eh.arrowhelper.cone.geometry.dispose();
            eh.arrowhelper.cone.material.dispose();
            delete (eh.arrowhelper);

            that.dispbrdL.scene.add(newArrowHelper);

            eh.arrowhelper = newArrowHelper;

        };

        this.ergosphere = (function initErgo(a) {
            const ergo = new Object;
            ergo.material = new THREE.MeshBasicMaterial({ color: 0x6495ed });
            ergo.material.opacity = 0.5;
            ergo.material.transparent = true;
            ergo.haveScaled = false;

            //r±E(m, a, θ)≡m±√m2−a2cos2θ,
            const points = [];
            for (let i = 0; i <= 21; i++) {
                let theta = Math.PI * i / 21;
                let costh = Math.cos(theta);
                let sinth = Math.sin(theta);
                let rErgo = 1. + Math.sqrt(1. - a * a * costh * costh); //M+Sqrt(M^2-a^2cos^2theta)
                points.push(new THREE.Vector2(rErgo * sinth, rErgo * costh)); //(Sqrt(x^2+y^2),z)

                //for Kerr Schild coordinates: ( (Sqrt(rErgo^2+a^2))*sin theta, rErgo*cos theta)
            }

            const ergoGeom = new THREE.LatheGeometry(points, 20);
            const newErgoMesh = new THREE.Mesh(ergoGeom, ergo.material);


            that.dispbrdL.scene.add(newErgoMesh);

            ergo.mesh = newErgoMesh;

            return ergo;

        })(this.state.a);

        function updateErgo(a) {
            const points = [];
            for (let i = 0; i <= 21; i++) {
                let theta = Math.PI * i / 21;
                let costh = Math.cos(theta);
                let sinth = Math.sin(theta);
                let rErgo = 1. + Math.sqrt(1. - a * a * costh * costh);
                points.push(new THREE.Vector2(rErgo * sinth, rErgo * costh));
            }

            const ergoGeom = new THREE.LatheGeometry(points, 32);


            //ehGeom.scale( xyR, rplus, xyR );
            const ergo = that.ergosphere;
            ergo.mesh.geometry.dispose();
            ergo.mesh.geometry = ergoGeom;

        };


        this.ZAMOGrid = (function initZAMOGrid() {
            //Note that many methods and other things document in threejs.org appears not to exist for us or have different names. We might need to get more from src/core, or something.
            const zg = new Object;
            zg.group = new THREE.Group();
            zg.material = new THREE.PointsMaterial({
                color: 0x0000ff,
                sizeAttenuation: true,
                //size: 3,       // in pixels
                size: .25, // in world units
            });

            const pi = Math.PI;
            const coss = [.9, .6, .3, 0, -.3, -.6, -.9];
            var sins = [];
            coss.forEach(function (value) { sins.push(Math.sqrt(1 - value * value)); });


            zg.layers = 5; //number of concentric spheres
            zg.levels = coss.length; //number of circles per sphere
            zg.radii = new Array(zg.layers);
            zg.rho = new Array(zg.layers);
            zg.pos = new Array(zg.layers);
            zg.geoms = new Array(zg.layers);
            zg.Segments = new Array(zg.layers);
            zg.circles = new Array(zg.layers);
            zg.Omegas = new Array(zg.layers);
            const segment_arclength = 4.2 / 2; //This seemed nice, but can be adjusted.


            //i is the i-th sphere layer, 
            //j is the j-th level circle (following the coss array)
            for (let i in [...Array(zg.layers).keys()]) {
                zg.radii[i] = new Array(zg.levels);
                zg.pos[i] = new Array(zg.levels);
                zg.geoms[i] = new Array(zg.levels);
                zg.circles[i] = new Array(zg.levels);
                zg.Omegas[i] = new Array(zg.levels);

                zg.rho[i] = 2.1 + 3 * i + .5 * i * i; //No math here; just seems to look good.
                zg.Segments[i] = 8; // Math.floor(2*pi*zg.rho[i]/segment_arclength);

                for (let j in [...Array(zg.levels).keys()]) {
                    zg.radii[i][j] = zg.rho[i] * sins[j];
                    //let vertices = makeCircleofVertices(zg.radii[i][j], Segments);//Usually one would set all the vertices, but we can use simple shapes.
                    let newCircle = new THREE.RingGeometry(zg.radii[i][j], zg.radii[i][j], zg.Segments[i]);
                    newCircle.rotateX(pi / 2);
                    zg.geoms[i][j] = newCircle;
                    let z = zg.rho[i] * coss[j];
                    zg.pos[i][j] = z; // may be redundant
                    zg.circles[i][j] = new THREE.Points(zg.geoms[i][j], zg.material);
                    zg.circles[i][j].position.y = z;
                    zg.group.add(zg.circles[i][j]);

                    zg.Omegas[i][j] = that.Omega(state.a, that.find_rBL(zg.rho[i], z, state.a), z);
                }
            }

            zg.updateOmegas = function (a) {
                for (let i in [...Array(zg.layers).keys()]) {
                    for (let j in [...Array(zg.levels).keys()]) {
                        let z = zg.rho[i] * coss[j];
                        zg.Omegas[i][j] = that.Omega(a, that.find_rBL(zg.rho[i], z, a), z);
                    }
                }

            };

            return zg;

        })();

        this.updateZAMOPoints = function (BLT) {
            // the spin is used to update Omegas separately, so this only takes BLT
            for (let i in [...Array(that.ZAMOGrid.layers).keys()]) { //number of concentric spheres
                for (let j in [...Array(that.ZAMOGrid.levels).keys()]) { //number of circles per sphere
                    //console.log(that.Omega(a,that.ZAMOGrid.radii[i][j],that.ZAMOGrid.pos[i][j]));//wrong radii
                    if (Corotating_Frame_Traj_On) { that.ZAMOGrid.circles[i][j].rotation.y = (that.ZAMOGrid.Omegas[i][j] - that.RefFrame_Omega) * BLT; }
                    else { that.ZAMOGrid.circles[i][j].rotation.y = that.ZAMOGrid.Omegas[i][j] * BLT; } //radians

                    //that.Omega(a,that.ZAMOGrid.rho[i],that.ZAMOGrid.pos[i][j])*BLT;
                }
            }

        };


        ////////////////////////////////////////////////////////////
        // Running the ODE integrator on a timer
        //let switchViewport=false; //This method does not run fast enough to not appear blinking.
        function runTick() {
            //that.ctrlbrd.suspendUpdate(); // Nothing in ctrlbrd is being updated.
            let currentindex = that.Geodesic.currentSolution.length - 1;
            let currentstep = that.Geodesic.currentSolution[currentindex];

            delT = Number(document.getElementById("Tstepslide").value);
            dtau = Number(document.getElementById("accuslide").value); //for some reason, this seems to just make the splicing speed to be some ratio of the concat-ing speed

            if (showZAMO) { that.updateZAMOPoints(currentstep[3] - that.historyLength); }

            that.Geodesic.updateSolution(currentstep, delT, null, dtau);
            that.Geodesic.updateTrajGeom(that.Geodesic.currentSolution);

            if (Corotating_Frame_Traj_On) { that.helper.rotateY(-1 * that.RefFrame_Omega * delT); }
            //let Cam2Pos= that.dispbrdR.camera.position;
            if (!FixedCamera) { //adjusts camera position.

                let currentDefaultCameraPos = new THREE.Vector3();
                currentDefaultCameraPos.copy(that.Geodesic.traj.object.geometry.vertices[that.Geodesic.traj.object.geometry.vertices.length - followingdistance]);
                let currentTarget = new THREE.Vector3();
                currentTarget.copy(that.Geodesic.traj.object.geometry.vertices[that.Geodesic.traj.object.geometry.vertices.length - 1]);

                if (FixedTarget) { //Orbitting Camera

                    Cam2Pos.copy(currentTarget); //end of trajectory   
                    that.dispbrdR.controls.update();
                    that.dispbrdR.controls.dollyOut(1.0 + .02 * that.zoom.Value());
                    //For some reason, doing it with dollyOut doesn't update the camera position until some point later.
                } else { //Trailing Camera

                    currentDefaultCameraPos.multiplyScalar(1.0 + .001 * that.zoom.Value());
                    Cam2Pos.copy(currentDefaultCameraPos);

                    //adjusts camera target.
                    that.dispbrdR.controls.target.copy(currentTarget);
                    that.dispbrdR.controls.update();
                }

            }

            // if(ZAMOcam){
            // ZAMOcam_block:{
            //     let sin_add, cos_add;
            //     const a=state.a;
            //     const rBL=that.find_rBL(Cam2Pos.length(),Cam2Pos.y,a);
            //     const rotation=that.Omega(a,rBL,Cam2Pos.y)*delT;//if(!rotation){throw new Error('rotation = '+rotation)}
            //     let current_x=Cam2Pos.x, current_z=Cam2Pos.z;
            //     if(rotation<.5){
            //     //Trig identities 
            //     const sinph=Math.sin(rotation);const cosph=Math.cos(rotation);
            //     sin_add=(x,y)=> (y * cosph + x * sinph);// Radius is multiplied in.
            //     cos_add=(x,y)=> (x * cosph - y * sinph);
            //     } else {//if(rotation>=1)console.log(rotation); 
            //         break ZAMOcam_block;}//Deep inside the Event Horizon, Omega diverges/ becomes unphysical.
            //     //The camera's position is in Cartesian coords, but Omega is in BLT coords.
            //     //Delta y 
            //     Cam2Pos.x = sin_add(current_z,current_x,rotation);if(isNaN(Cam2Pos.x)){throw new Error('Cam2Pos.x = '+Cam2Pos.x);}
            //     //Delta x 
            //     Cam2Pos.z = cos_add(current_z,current_x,rotation);if(isNaN(Cam2Pos.z)){throw new Error('Cam2Pos.z = '+Cam2Pos.z);}
            // }
            // }
            if (ZAMOcam) {
                if (Cam2Pos.length() > 1.72) { //Deep inside the Event Horizon, Omega diverges/ becomes unphysical.
                    that.LieDrag(Cam2Pos, delT);
                }
            }
            that.dispbrdR.camera.Dot.position.copy(Cam2Pos);
            that.dispbrdL.camera.Dot.position.copy(that.dispbrdL.camera.position);
            //that.ctrlbrd.unsuspendUpdate();
            document.getElementById("BLtime").innerHTML = currentstep[3].toFixed(4);
            tickTime = 100 - document.getElementById("framerate").value; //100ms is the max. The values are reversed so that left on the slider is slower.
            if (playingstate)
                timeoutID = window.setTimeout(runTick, tickTime);
        }

        this.togglePlayState = function () {
            if (playingstate) {
                window.clearTimeout(timeoutID);
                playingstate = false;
                document.getElementById('playpause').value = "Play";
            } else {
                timeoutID = setTimeout(runTick, tickTime);
                playingstate = true;
                document.getElementById('playpause').value = "Pause";
            }
        };

        this.toggleZAMOs = function () {
            if (showZAMO) {
                that.dispbrdL.scene.remove(that.ZAMOGrid.group);
                showZAMO = false;
                document.getElementById('showZAMOPoints').value = "Show ZAMOs";
            } else {
                that.dispbrdL.scene.add(that.ZAMOGrid.group);
                showZAMO = true;
                document.getElementById('showZAMOPoints').value = "Hide ZAMOs";
            }
        };

        let ResCurveOn = false, ResGlider = false, ResTarget = 2 / 3, ResSwitch = 'r/theta'; //Options are 'r/theta' 'r/phi' and 'theta/phi'
        var ResCurve;

        this.toggleResCurve = function () {
            if (ResCurveOn) {
                ResCurve.undraw();
                ResCurveOn = false;
            } else {
                if (ResCurve == undefined) {
                    that.ResCurve = new ResController(this.ctrlbrd);
                    ResCurve = that.ResCurve;
                    ResCurve.updateGraph(state.a, state.x);//,...that.Geodesic.ParamArray); 
                    //ResCurve.updateDisplay();
                }
                ResCurveOn = true;
                if ((ResCurve.getEs()).length > 0) {
                    ResCurve.updateGraph(state.a, state.x);//could benefit from an isDirty parameter
                    ResCurve.updateDisplay();
                }
            }
        };

        this.updateResCurve = function (option) {
            let worked = false;
            if (ResCurveOn) {
                // an isDirty attribute may be helpful here
                // if (ResCurve == undefined) {
                //     that.ResCurve = new ResController(this.ctrlbrd);
                //     ResCurve=that.ResCurve;
                // }
                // else{
                ResCurve.Controls.TargetR = document.getElementById('RforRatio').value;
                ResCurve.Controls.TargetT = document.getElementById('TforRatio').value;
                ResCurve.Controls.TargetP = document.getElementById('PforRatio').value;

                ResCurve.Controls.SelectedRatio = option;
                //ResCurve.Controls.TargetRes=
                //may need a version of this here
                //if (targ > 1) { alert('Choose a ratio that is less than or equal to 1. Omega_r <= Omega_theta <= Omega_phi');  }

                //ResCurve.updateGraph(ResSwitch, ResTarget, state.a, state.x); ResCurve.updateDisplay();
                worked = ResCurve.updateGraph(state.a, state.x);//,...that.Geodesic.ParamArray);
                if (worked) {
                    if (ResGlider) { that.userpoint.free(); }
                    ResCurve.updateDisplay();
                    if (ResGlider) { that.userpoint.makeGlider(ResCurve.curve); that.ctrlbrd.update(); }
                }
                else { ResCurve.undraw(); that.ctrlbrd.update(); }//'Update' can only be clicked when ResCurveOn is true
            }
            return worked
        }
        this.toggleGliderAttribute = function (bool) {
            if (bool) {
                that.userpoint.makeGlider(ResCurve.curve); ResGlider = true;
                that.GeodesicReConstructor(state.p, state.a, state.e, state.x, dtau);
            }
            else { that.userpoint.free(); ResGlider = false; }
            that.ctrlbrd.update();
        }

        // // Not Implemented
        // this.toggleRotatingFrame = function (checkbox) {
        //     Corotating_Frame_Traj_On = checkbox.checked;
        //     if (checkbox.checked && document.getElementById("cameraSwitcher").value != "fixed") { console.log("Camera must be 'Fixed' for Coratation to work.") }
        // }

        // this.switchRefFrame = function (option) {
        //     if (document.getElementById("cameraSwitcher").value = "fixed") {
        //         switch (option) {
        //             case "static":
        //                 Corotating_Frame_Traj_On = false;
        //                 that.RefFrame_Omega = 0;
        //                 break;
        //             case "resonant":
        //                 Corotating_Frame_Traj_On = true;
        //                 that.RefFrame_Omega = that.Geodesic.Frequencies[2];
        //                 break;
        //             case "ZAMO":
        //                 Corotating_Frame_Traj_On = true;
        //                 that.RefFrame_Omega = that.dispbrdR.camera.Omega;
        //                 break;

        //         }
        //     } else { console.log("Camera must be 'Fixed' for Coratation to work."); }

        //     that.GeodesicReConstructor(state.p, state.a, state.e, state.x, dtau);
        // };

        this.switchCamera = function (option, dolly_scalar) {
            let currentCameraPos = new THREE.Vector3();
            let currentTarget = new THREE.Vector3();
            switch (option) {
                case "fixed":
                    //that.dispbrdR.camera.position.set(6, 5, that.zoom.Value()); //reset camera
                    that.dispbrdR.controls.target.copy(that.dispbrdR.controls.target0); // resest target
                    that.dispbrdR.controls.update();

                    FixedCamera = true;
                    FixedTarget = true;
                    ZAMOcam = false;
                    if (Corotating_Frame_Traj_On) { document.getElementById('Corotate').checked = false; }
                    //document.getElementById("switchRefFrame").disabled = false;

                    if (!doton) { that.dispbrdL.scene.add(that.dispbrdR.camera.Dot); doton = true; }

                    break;
                case "orbitting":
                    currentCameraPos.copy(that.Geodesic.traj.object.geometry.vertices[that.Geodesic.traj.object.geometry.vertices.length - followingdistance]);
                    that.dispbrdR.camera.position.copy(currentCameraPos);

                    that.dispbrdR.controls.target.copy(that.dispbrdR.controls.target0); // reset target

                    that.dispbrdR.controls.update();
                    that.dispbrdR.controls.dollyOut(1.1);

                    FixedCamera = false;
                    FixedTarget = true;
                    ZAMOcam = false;
                    if (Corotating_Frame_Traj_On) { document.getElementById('Corotate').checked = false; }
                    //document.getElementById("switchRefFrame").disabled = true;
                    if (Corotating_Frame_Traj_On) {
                        Corotating_Frame_Traj_On = false;
                        //document.getElementById('switchRefFrame').value = "static";
                    }

                    if (doton) { that.dispbrdL.scene.remove(that.dispbrdR.camera.Dot); doton = false; }
                    break;
                case "trailing":
                    currentCameraPos.copy(that.Geodesic.traj.object.geometry.vertices[that.Geodesic.traj.object.geometry.vertices.length - followingdistance]);
                    currentCameraPos.multiplyScalar(1.01);
                    that.dispbrdR.camera.position.copy(currentCameraPos);

                    currentTarget.copy(that.Geodesic.traj.object.geometry.vertices[that.Geodesic.traj.object.geometry.vertices.length - 1]);
                    that.dispbrdR.controls.target.copy(currentTarget);

                    that.dispbrdR.controls.update();

                    FixedCamera = false;
                    FixedTarget = false;
                    ZAMOcam = false;
                    if (Corotating_Frame_Traj_On) { document.getElementById('Corotate').checked = false; }
                    //document.getElementById("switchRefFrame").disabled = true;
                    if (Corotating_Frame_Traj_On) {
                        Corotating_Frame_Traj_On = false;
                        //document.getElementById('switchRefFrame').value = "static";
                    }

                    if (doton) { that.dispbrdL.scene.remove(that.dispbrdR.camera.Dot); doton = false; }
                    break;
                case "ZAMO":
                    that.dispbrdR.controls.target.copy(that.dispbrdR.controls.target0); // reset target
                    that.dispbrdR.controls.update();

                    FixedCamera = true;
                    FixedTarget = true;
                    ZAMOcam = true;

                    //document.getElementById("switchRefFrame").disabled = true;
                    if (Corotating_Frame_Traj_On) {
                        Corotating_Frame_Traj_On = false;
                        //document.getElementById('switchRefFrame').value = "static";
                    }

                    if (!doton) { that.dispbrdL.scene.add(that.dispbrdR.camera.Dot); doton = true; }
                    break;
            }
        };



        // Hit play!
        this.togglePlayState();
        //this.toggleZAMOs();//Show ZAMOs
    }
}
const toy = new GeodCont();
