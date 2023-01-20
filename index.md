---
layout: page
title: "Simulator for Bound Geodesics in Kerr Spacetime"
modified:
categories:
excerpt:
tags: []
image:
  feature:
date: 2022-11-05T08:00:00-04:00
jsxgraph: true
---
<!-- https://github.com/mathjax/MathJax/issues/1988#issuecomment-384978927
     Use plain Javascript to prevent the use of window.eval(). Then
     'unsafe-eval' won't be needed to be added to script-src CSP.

     Also move the mathjax config to a separate file from the inline script so
     that 'unsafe-inline can also be removed from script-src CSP.
-->
<!--#%{{ $$mathjax_js := resources.Get "js/mathjax-config.js" | minify | fingerprint }}
<script src="{{ $$mathjax_js.RelPermalink }}"></script>
<!-- Enable HTTP/2 Push -->
<!--#%<link rel="preload" href="{{ $$mathjax_js.RelPermalink }}" as="script">

<!-- https://gohugo.io/content-management/formats/#mathjax-with-hugo -->
<!--<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.4/MathJax.js?config=TeX-AMS_HTML"></script>
<!-- <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.4/MathJax.js?config=TeX-MML-AM_CHTML"></script> -->
<!--<style>
.tex, .latex, .tex sub, .latex sub, .xetex sub {
  font-size: 1em;
}

.tex sub, .latex sub, .latex sup, .xetex sub {
  text-transform: uppercase;
}

.tex sub, .latex sub, .xetex sub {
  vertical-align: -0.5ex;
  margin-left: -0.1667em;
  margin-right: -0.125em;
}

.latex sup {
  font-size: 0.85em;
  vertical-align: 0.15em;
  margin-left: -0.36em;
  margin-right: -0.15em;
}
</style> -->

<style>

      .box div {
        display: inline-block;
        vertical-align: middle;
        position:relative;
      }
      p {
        margin-top: 0.25rem;
        margin-bottom: 0.5rem;
      }
      
</style>

<!-- Here is the "safe" way to write LaTeX, without fear of kramdown
clobbering something:
<div>
\begin{align}
G_{ab} = 8\pi T_{ab}
\end{align}
</div> -->
<!--     let kgbo= KerrGeoBoundOrbitQ(a.Value(), q.X(), q.Y(), x.Value());
    console.log(kgbo);
    var delta = brd.create('slider',[[9,.1],[9,.9],[0,0,Math.PI]],{name:'&delta;'});
Here is a 2D Schwarzschild orbit: -->

<details markdown="1" open>
<summary markdown="1">

### Introduction
{: style="display:inline"}
</summary>

In General Relativity (GR), massive objects distort the spacetime around them. This can be seen in the metric tensor, $$g_{\alpha\beta}$$, which is a set of numbers that determines how relative distances between points are measured in different directions. To see how this dictates paths objects may take, we can construct combinations of derivatives of the metric components, or 'connections', a useful example being the Christoffel connection coefficients, or Christoffel symbols, $$\Gamma^{\gamma}{}_{\alpha\beta}$$, which gives the difference between connections/derivatives. Gravity arises from constructing a combination of second derivatives of the metric, or 'curvature', which can be encoded in the Riemann curvature tensor, $$R^{\rho}{}_{\sigma\alpha\beta}$$.

The extreme limits of gravity exist near black holes. The prominent effect of a central gravitating body is to warp the surrounding spacetime in such a way that nearby masses tend to 'fall inward' directly towards the gravitating body. However, when a massive body spins, it can be thought of as slightly 'dragging' the surrounding spacetime around with it, which influences nearby test masses to 'fall' slightly _around_ the central body as it falls inward. This effect of general relativity is small enough to go unnoticed in everyday life, but in extreme environments, as in near a black hole, the effect can become much more pronounced.

When a stationary black hole is spinning, it is called a Kerr black hole, and the characteristic spacetime distortion it generates is called Kerr spacetime.
</details>

<!-- Display and Controls -->
<div class="container" style="width: 100%; overflow: hidden;">
  <div id="animbox" style="position:relative; width:350px; height:300px;" ></div><!-- THREE.Bootstrap creates a canvas element within this div element with it's own dimensions, so altering the div after the canvas has loaded doesn't alter the canvas. I can hide/unhide one display, but both the div size and the canvas size of the other need to be simultaneously updated. After pages loads, set anibox h and w to 0px. then animbox 2 and its canvas can have style size altered. Don't change the canvas's h and w properties (separate from the style h/w) without finding an easy way to recenter the viewport, (note that the larger canvas makes everything appear dimmer.)-->
  <div id="animbox2" style="position:relative; width:700px; height:600px; z-index:1;"></div>
</div>

<div id="play buttons" class="box">
<div>
<input type="button" id="playpause" value="Pause" onclick="toy.togglePlayState();" style="width:4em;margin:0.5em" />

<input type="button" id="showZAMOPoints" value="Show ZAMOs" onclick="toy.toggleZAMOs();" style="width:9em;margin:0.5em;margin-right:0em;" />
</div>
<tooltip for="showZAMOPoints" position="right" data-position="right down" data-content='showZAMO-TT'>
</tooltip>
<div id='showZAMO-TT' markdown="1" style='display:none'>
Toggle display for a grid of Zero Angular Momentum Observers (ZAMOs).  
This illustrates the rate at which spacetime 'flows' around the black hole due to its spin.  

[See Explanation Below](#zamos)
</div>

<div>
<label for="cameraSwitcher" style="display: inline;text-align:left;margin:0.5em;margin-right:0em">Camera:</label>
  <select name="options" id="cameraSwitcher" onChange="toy.switchCamera(cameraSwitcher.value);" style="margin-right:0em;">
    <option value="fixed">Fixed</option>
    <option value="orbitting">Orbitting</option>
    <option value="trailing">Trailing</option>
    <option value="ZAMO">ZAMO</option>
  </select>
</div>
<tooltip for="cameraSwitcher" position="right" data-position="right down" data-content="cameraSwitcher-TT">
</tooltip>
<div id="cameraSwitcher-TT" markdown="1" style='display:none'>

* Fixed Camera (Default): User can click, drag, and scroll at any time.
* Orbitting Camera: Camera moves, following the head of the trajectory while always pointing towards the central black hole.
* Trailing Camera: Like Orbitting Camera, except the camera points towards the head of the trajectory while staying slightly behind it. Zoom in all the way for 'Roller Coaster Mode'. Zoom out to keep the black hole in view.
* ZAMO Camera: The camera will follow the path of a ZAMO, flowing with the spacetime around the black hole. [See Discussion Below](#zamos)

[More Details Below](#camera-controls)
</div>
<div>
<input type="button" id="Toggle2ndDisplay" value="2nd Display" onclick="toy.toggleDisplay();" style="width:9em;margin:0.5em;margin-left:1.5em;margin-right:0em;" />
</div>
<!--<div style="margin:0.5em">
  <label for="frameSwitcher" style="display: inline;text-align:left;margin:0.5em">Reference Frame:</label>
    <select name="options" id="frameSwitcher" onChange="toy.switchRefFrame(frameSwitcher.value);">
      <option value="static">Static</option>
      <option value="resonant">Resonant</option>
      <option value="ZAMO">ZAMO</option>
    </select>
  <form id="Ref_Frames">
  <label for="Corotate" > Co-rotating Reference Frames </label>
    <input type="checkbox" id="Corotate"  style="vertical-align: middle; position: relative; float: right; left:2px;top:2px" onChange="toy.toggleRotatingFrame(this);"> 
    <label style="font-weight: normal"><input type="radio" style="vertical-align: middle; position: relative; float: right; left:2px;top:2px" id="zamo_cam_pos" name="Frame" value="zamo_cam_pos"> ZAMO </label>
    <label style="font-weight: normal"><input type="radio" style="vertical-align: middle; position: relative; float: right; left:2px;top:2px" id="Resonant_Freq" name="Frame" value="Resonant_Freq" checked> Resonant </label>
    Requires 'Fixed' Camera
  </form>
  </div>-->

<!-- <tooltip for="play buttons" icon-position="right" data-position="right down" data-content="playBtns-TT">
</tooltip>
<div id="playBtns-TT" markdown="1" style='display:none'>
Toggle Secondary Display
</div> -->
</div>

<div class='box' markdown='1'>

##### Orbit Controller
{: style="display:inline-block; margin-top: .25rem; margin-bottom: 0.5rem; width:50%;"}
<div id="sepbox" class="jxgbox" style="width:320px; height:300px; float:right;" onmouseenter="if(toy.userpoint.hasLabel == true) { toy.userpoint.hasLabel = false; toy.userpoint.setLabelText('');}">
</div>

<tooltip for="sepbox" style='float:right; padding-right:10px;' data-position="down left" data-content='orbitControls-TT'>
</tooltip>
<div id='orbitControls-TT' style='width:45%; max-width: calc(100% - 326px); display:none' markdown="1">
<b><u>Orbit Controller Graph</u></b>

* **spin**: How fast the black hole is spinning. This affects how things orbit it.
* **inclination**: How far off from the equator of the black hole the trajectory points. +1 sends the orbit in the direction the black hole is spinning. -1 sends it in the opposite direction.
* **e** *(y-axis for red dot)*: eccentricity -- how oval-shaped the orbit is. **e** = 0 is circular (distance from the black hole is constant).
* **p** *(x-axis for red dot)*: semi-latus rectum -- Distance from the black hole when **e** = 0.

[See Explanations Below](#orbit-controls)
</div>
<!-- <div class="box">
<div id="sepbox" class="jxgbox" style="width:320px; height:300px; float:right;position: relative; left: inherit; top: inherit;" onmouseenter="if(toy.userpoint.hasLabel == true) { toy.userpoint.hasLabel = false; toy.userpoint.setLabelText('');}">
</div>
<tooltip for="sepbox" data-position="down" data-content='orbitControls-TT' style='position: relative; left: 95%; top: inherit; float:right;'>
</tooltip>
</div>
<div id='orbitControls-TT' markdown="1">
### How Do _I_ Look? Orbit Controls
Do I look good?
</div> -->

<div class='box'>
<details style='float:left'>
<summary>
Details:
</summary>
<span id="Constants"></span>
<tooltip for="Constants" style='float:right' icon-position="right" data-position="down left" data-content='constants-TT'>
</tooltip> 
<div id ='constants-TT' style='width:100%; display:none' markdown="1">
**Constants of Motion:**  
E -- Energy,  
Lz -- Orbital Momentum in direction of spin (z-component),  
Q -- Carter's Constant
</div>
<br/>
<div class='box' style="vertical-align: top">
B-L time T = <span id="BLtime" ></span><br/>
proper time: step size &Delta;&tau; = <span id="ptime:1"></span><br/>
accumulated &tau; = <span id="ptime:2"></span>
</div>
<tooltip for="Clocks" icon-position="right" data-position="down right" data-content='Clocks-TT'>
</tooltip> 
<div id ='Clocks-TT' style='width:125%; display:none' markdown="1">
**Clocks:**

* Total Boyer-Lindquist time that has passed for the trajectory. This represents elapsed time as recorded by a distant observer.  
* "Proper Time" is how time is passing in the reference frame of the orbit, i.e. the head of the displayed trajectory. 
  * The 'step size' displayed approximates how much time a clock orbitting the black hole experiences in one second of B-L time. 
  * The accumulated or total proper time passed is displayed for comparison with the total B-L time.

[See Explanations Below](#time-and-animation)
</div>
</details>
</div>
<div class='box' style='width:53%'>
<p style='display:inline'>Path Length: </p><output name="x" form="player" for="histslide Tstepslide">250</output>
<tooltip for="player" position="right" data-position="right up" data-content='player-TT'>
</tooltip>
<div id='player-TT' style="width:max-content; display:none" markdown='1'>
How many B-L seconds of the trajectory are displayed
</div>
<form id="player" style="display: flex" oninput="x.value=parseFloat(histslide.value)+parseFloat(Tstepslide.value)">
<input id="histslide" type="range"
 name="history" min="10" max="3000" step="10" value="250"
     onchange="
       toy.historyPoints = parseFloat(this.value);
       toy.historyLength = parseFloat(Tstepslide.value)*parseFloat(this.value);
       toy.GeodesicReConstructor(toy.state.p,toy.state.a,toy.state.e,toy.state.x,parseFloat(accuslide.value));
       " />
</form>
</div>
</div>

<!----- Resonace Tool ----->
<!--<label for="ResCtrlPanel">Resonance Surface Controls: </label>-->

###### Resonance Controller
{: style="display:inline-block; margin-top: 0.5rem; margin-bottom: 0.5rem;"}

<tooltip for="Freq" position="right" data-position="right up" data-content='freq-TT'>
</tooltip>
<div id='freq-TT' markdown="1" style='display:none'>

* On/Off Switch: Draws/Undraws the chosen Resonance Curve on the Orbit Controller graph.
* Ratio Integers: Enter three integers representing the ratios of the orbital frequencies in the three respective directions of motion: radial, polar, and azimuthal.
* 'Find this Ratio': Bind/unbind the Orbit Controller dot to/from the Resonance Curve.
* Update: Apply changes made to the selected resonance ratio.

[More Details](#resonance-controls)  
[Discussion](#orbital-frequencies)
</div>
<div class="box">
<p id="Freq" style="display:block"></p>
<form id="ResCtrlPanel" style="display:inline-flex">
 <table style="display:inline-block; margin-bottom:0em;"><tbody>
  <tr>
    <td>
    <input type="button" id="RCon/off" value="On" onclick="toy.toggleResCurve();if(this.value=='Off'){this.value='On';MatchFreqQ.checked=false; MatchFreqQ.disabled=true;UpdateRC.disabled=true;}else{this.value='Off';MatchFreqQ.disabled=false;UpdateRC.disabled=false;}"/>
    </td>
    <td>
    <select type="dropbox" id="RatioMenu" name="RatioMenu" onchange="switch(this.value){case 'r/t':RforRatio.disabled=false;TforRatio.disabled=false;PforRatio.disabled=true;break; case 'r/p':RforRatio.disabled=false;TforRatio.disabled=true;PforRatio.disabled=false;break; case 't/p':RforRatio.disabled=true;TforRatio.disabled=false;PforRatio.disabled=false;break;}" style="width:5em">
    <option value="r/t" selected> &Omega;<sub>r</sub>/&Omega;<sub>&theta;</sub> </option>
    <option value="r/p" disabled> &Omega;<sub>r</sub>/&Omega;<sub>&phi;</sub> </option>
    <option value="t/p" disabled> &Omega;<sub>&theta;</sub>/&Omega;<sub>&phi;</sub> </option> <!-- For now, the default is x=0 when the page loads, but it is the 'drag' function that enables/disables. -->
    </select>
    </td>
    <td>
      <table style="display:block; margin-bottom:0em;"><tbody>
      <tr>
      <td>   &Omega;<sub>r</sub> </td> <td>:   &Omega;<sub>&theta;</sub> </td> <td>:   &Omega;<sub>&phi;</sub> </td>
      </tr>
      <tr>
      <td><input type="number" id="RforRatio" style="width:3em" value=2 step=1 onchange="this.value = parseInt(this.value);if(parseInt(this.value)==0){this.value=1;}if(parseInt(TforRatio.value)<=parseInt(this.value)){TforRatio.value=parseInt(this.value)+1;}if(parseInt(PforRatio.value)<=parseInt(this.value)){PforRatio.value=parseInt(this.value)+1;}"/> :</td> <td>
      <input type="number" id="TforRatio" style="width:3em" value=3 step=1 onchange="this.value = parseInt(this.value);if(parseInt(this.value)==0){this.value=1;}if(parseInt(this.value)<=parseInt(RforRatio.value)){this.value=parseInt(RforRatio.value)+1;}"/> :</td> <td>
      <input type="number" id="PforRatio" style="width:3em" value=3 step=1 onchange="this.value = parseInt(this.value);if(parseInt(this.value)==0){this.value=1;}else if(parseInt(this.value)<=parseInt(RforRatio.value)){this.value=parseInt(RforRatio.value)+1;}" disabled/></td>
      </tr></tbody></table>
    </td>
    </tr>
    <tr><td colspan="2">
    <label for="MatchFreqQ" style="display:inline-block"> Find this Ratio </label><input type="checkbox" id="MatchFreqQ" style="margin:0.5em" onchange="toy.toggleGliderAttribute(this.checked);" disabled>
    </td>
    <td>
    <input type="button" id="UpdateRC" style="float:right" value="Update Graph" onclick="let curveappears=toy.updateResCurve(RatioMenu.value);if(!curveappears){MatchFreqQ.checked=false; MatchFreqQ.disabled=true;}else if(MatchFreqQ.disabled==true){MatchFreqQ.disabled=false;}" disabled/>
    </td>
    <!-- <td>
    <input type="number" id="DeltaPhiOver2piDesired" style="width:5em;margin:0.5em" onchange="processMatchFreqUI()" value="1.333" readonly="" step="any" />
    </td>-->
  </tr>
 </tbody>
 </table></form>
 </div>

<!--###### Animation Controls:-->
<div class="box" style="display:inline">
<details markdown="1">
<summary markdown="1">

###### Advance Options
{: style="display:inline-block; margin-top: 1.25rem; margin-bottom: 0.5rem;"}

</summary>
<div class="box" id="sliders" style="width:50%">
Animation Speed: <input id="framerate" type="range"
 name="playspeed" min="0" max="90" step="5" value="30" /><!-- 0 corresponds with 10 frames/second, 90 gives 100 frames/second -->
<div class="box" style="width:110%">
<div class="box" style="width:25%">
&Delta;T: <input id="Tstepslide" type="number"
 name="dT" min="0.1" max="5.0" step="0.1" value="1" style="display:inline"/>
 </div>
<div class="box" style="width:25%">
d&tau;: <input id="accuslide" type="number"
 name="dtau" min="0.01" max="0.5" step="0.01" value="0.05" style="display:inline"/>
 </div>
<div class="box" style="float:right">
<tooltip for="Advanced Options" icon-position="right" data-position="right up" data-content='advOptions-TT'>
</tooltip>
<div id='advOptions-TT' markdown="1" style='display:none'>

* Animation Speed: Frame rate of the animation player
* &Delta;T: Desired B-L Time per frame
* d&tau;: Integration step size to be used by the integrator

[See Explanations Below](#time-and-animation)
</div>
</div>
</div>
</div>
</details>
</div>
<br/>  

<!--  <form oninput="brd.suspendUpdate();[ppoints,epoints]=updateSeparatrix(a.value,x.value,epoints,ppoints,numPoints);brd.update();brd.unsuspendUpdate();">
  <input type="range" name="a" min="0" max=".99" step=".01" value=".9" />
  <br/>
  <input type="range" name="x" min="-1" max="1" step=".01" value="0" /> 
</form> -->
<tooltip style='display:none' data-content='dummy-TT'></tooltip>
<div style='display:none' id='dummy-TT'></div>
<!-- <form><input type="button" value="test point" onClick="query();"></form> -->

<script type="text/javascript" src="{{ site.url }}/assets/js/tooltips.js"> </script>

<script type="text/javascript" src="{{ site.url }}/assets/js/fraction.min.js"></script>
<script type="text/javascript" src="{{ site.url }}/assets/js/complex.min.js"></script>
<script type="text/javascript" src="{{ site.url }}/assets/js/quaternion.min.js"></script>
<script type="text/javascript" src="{{ site.url }}/assets/js/polynomial.min.js"></script>

<script type="text/javascript" src="{{ site.url }}/assets/js/vendor/three.min.js"></script>
<script type="text/javascript" src="{{ site.url }}/assets/js/vendor/threestrap.min.js"></script>
<!--<script type="text/javascript" src="{{ site.url }}/assets/js/vendor/OrbitControls.js"></script>-->

<script type="text/javascript" src="{{ site.url }}/assets/js/elliptic.js"></script>
<script type="text/javascript" src="{{ site.url }}/assets/js/KerrFrequencies.js"></script>

<script type="text/javascript" src="{{ site.url }}/assets/js/integrator.js"></script>
<script type="text/javascript" src="{{ site.url }}/assets/js/findroots.js"></script>
<script type="text/javascript" src="{{ site.url }}/assets/js/KerrB.js"> </script>
<script type="text/javascript" src="{{ site.url }}/assets/js/SepController.js"> </script>
<script type="text/javascript" src="{{ site.url }}/assets/js/GeodesicController.js"> </script>

<!-- This allows animbox2 to cover animbox without the animbox canvas disappearing. -->
<script> 
document.getElementById('animbox').style.height='0px';
document.getElementById('animbox').style.width='0px';
</script>

<!--<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/MathJax.js?config=TeX-MML-AM_CHTML"></script>
<script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
 Version 2 
<script async src="https://cdn.jsdelivr.net/npm/mathjax@2/MathJax.js?config=TeX-AMS-MML_CHTML"></script>-->
<!-- Version 3 
<script src="https://polyfill.io/v3/polyfill.min.js?features=es6"></script>
<script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script> -->

<details markdown="1">
<summary markdown="1">

### Orbit Controls
{: style="display:inline"}
</summary>

* $$a$$ or 'spin': represents the spin of the black hole. This is controlled with the first slider and ranges from 0 to .99, where $$a=0$$ means no rotation (Schwarzschild case) and $$a=1$$ is the upper limit allowed by GR. Changing the spin of the black hole also changes the shape of both the Event Horizon (presented as a black surface) and the Ergosphere (presented as a light blue surface).
* $$x$$ or 'inclination': gives the orbital inclination, $$x=\cos(i)$$, and is controlled by the second slider. For a pro-grade, equatorial orbit, $$x=1$$, $$i=0^{\circ}$$, $$\theta_{\min}=\pi/2$$, and the Cartesian $$z_{m}=\cos(\theta_{\min})=0$$. Similarly, $$x=0$$ corresponds to polar orbits --- $$i=90^{\circ}$$, $$\theta_ {\min}=0$$, $$z_{m}=1$$ --- and $$x=-1$$ corresponds to retrograde, equatorial orbits --- $$i=180^{\circ}$$, $$\theta_ {\min}=\pi/2$$, $$z_{m}=0$$. $$z_m$$ can also be expressed as $$z_m=\sqrt{1 - x^2}$$.
* $$e$$: is the orbital eccentricity. This ranges from 0 to .99 on the y-axis of the graph and is controlled by dragging the red dot.
* $$p$$: is the semi-latus rectum (the 'size' of the orbit). $$p$$ and $$e$$ together give the minimum and maximum radius of the orbit, $$r_{\min}=\frac{p}{1 + e}$$ and $$r_{\max}=\frac{p}{1 - e}$$.  
 This is also controlled by dragging the red dot. The minimum value for $$p$$ is represented by the calculated curve on the graph, called 'the separatrix', [(see the discussion about the separatrix below)](#separatrix). The separatrix is the boundary between stable orbits and plunging orbits. Setting the dot to the left of the curve shown would result in the trajectory falling into the black hole, and so is not allowed by the controller.


</details>

<details markdown="1">
<summary markdown="1">

### Camera Controls
{: style="display:inline"}
</summary>
One large display, or two smaller displays when '2nd Display' is on, appear viewing the black hole and trajectory from different camera perspectives. By default, camera position can be manipulated via standard dragging and scrolling on the display window.
When '2nd Display' is on, the large display becomes the right display. A yellow dot in the scene on the right shows the location of the left display's camera and a green dot in the scene to the left shows the position of the right display's camera.  
A 'Zoom' slider is placed at the bottom of the separatrix graph. Both the zoom and the max value of the zoom slider are adjusted to the size of the orbit; so as the orbit is adjusted, the zoom adjusts with it. The effect of 'Zooming' with the slider is different for each camera setting.  
The drop-down list of Camera settings only controls the secondary display. The left camera, or 2nd Display, is always a 'Fixed' camera.
The options for the right/main display are:

* Fixed Camera: The camera orientation remains static unless moved by the user. The 'Zoom' is the radial distance of the camera from the central black hole. This is identical to the effect of 'scrolling' with a mouse or fingers, except that, if the user has manually moved the camera, then adjusting the slider (or any orbital parameter) will reset the camera to a default position. (Currently, this zooming behavior for a fixed camera only affects the primary display. One can reset the second camera position by switching to another camera setting and then switching back to 'Fixed'.)
* Orbiting Camera: While the camera continues targeting the central black hole, the camera position orbits alongside the head of the trajectory. In this setting, manual control of the camera is only possible when the animation is Paused, and the effect of the Zoom slider can only be seen when the animation is playing. Zoom still adjusts the radial distance of the camera, but the range is limited so that the minimum is the radial position of the head of the trajectory. The maximum is also smaller than for Fixed Camera.
* Trailing Camera: The camera is turned to target the head of the trajectory while trailing closely behind. In this way, the viewer 'rides' the trajectory in roller-coaster fashion. Again, manual control of the camera is only possible when the animation is Paused, and the effect of the Zoom slider can only be seen when the animation is playing. Zooming out swings the camera away from the central black hole so that the camera -- still targeting the head of the trajectory -- is turned more towards the black hole. When zoomed out enough, this setting may resemble the Orbiting Camera setting. Note that a segment of the trajectory becomes invisible when it is too close to the camera, and this especially affects what is seen by the trailing camera.
* ZAMO Camera: Wherever the camera is currently located, it will begin orbiting along the worldline of a Zero Angular Momentum Observer. Because the orbital velocity of ZAMOs diverges and becomes unphysical inside the black hole, the rotation is disabled if the camera is too close to the center of the black hole.

Next to the Play/Pause button is the Show/Hide ZAMOs button. This adds to the scene a spinning spherical grid of blue cubes representing Zero Angular Momentum Observers (ZAMOs). An explanation of ZAMOs can be found below.
</details>
<!--A ZAMO is an observer that follows a circular path around the spin axis of a Kerr black hole with an orbital velocity equal to the 'frame-dragging' rate of the Kerr spacetime at the radius and polar angle of the observer, thus the observer has no angular momentum around the axis parallel to the spin of the black hole. A very distant observer viewing a ZAMO close to the black hole sees that ZAMO moving around the black hole and would measure a mass following that observer to have orbital momentum. But in the reference frame of the ZAMO, it doesn't have any orbital momentum, because its frame is being 'dragged' at the same rate as its motion. This makes ZAMOs useful for illustrating the 'frame dragging' effect. \\
A more detailed discussion of ZAMOs can be found in section \ref{ZAMOs}.-->

<details markdown="1">
<summary markdown="1">

### Time and Animation
{: style="display:inline"}
</summary>

The Boyer-Lindquist (B-L) coordinate time of the trajectory is tracked and displayed. The proper time of the geodesic is also visible, both the accumulated proper time and the average amount of proper time per frame that is passing at the head of the trajectory. When the eccentricity is high, you can see that the rate at which proper time passes becomes similar to that of the B-L time when the trajectory gets further from the central black hole and shrinks when it gets closer.  
The 'Path Length' slide controls length, or 'memory', of the path displayed. The number represents the number of $$\Delta$$T steps recorded, so the actual length of the path that appears will vary over time as the velocity varies.

Under the 'Advanced Options' are various time controls. Adjusting these can affect the performance of the integrator, and they can typically be left at their default values:  
The Animation Speed controls the frame rate of the animation, while $$\Delta$$T is the (approximate) amount of B-L time per frame. The slowest frame rate is 10 fps and the fastest is 100 fps. To make one B-L second pass over one second in real time (almost -- it can be a bit slower than real seconds), set the Animation and $$\Delta$$T (and  d$$\tau$$, ideally) to their minimum values (10 frames/sec and 0.1 B-L sec/frame). If $$\Delta$$T is too small compared to d$$\tau$$, the integrator will stop, and the red path will gradually disappear. Another side effect of adjusting $$\Delta$$T is scaling the displayed length of the trajectory. d$$\tau$$ is the amount of proper-time passed per integration step; in other words, it's the step-size used by the integrator. Making this smaller increases both the precision of the trajectory and the number of computations per frame. Note, however, that the amount of proper time, or number of steps, per frame varies to maintain a constant passage of B-L time. This means that the passage of time as seen in the animation is more representative of what an observer at infinity would see, rather than the passage of time experienced by an object following the trajectory -- that is, the proper time.
</details>

<details markdown="1">
<summary markdown="1">

### Resonance Controls
{: style="display:inline"}
</summary>

* On/Off Switch: Draws/Undraws a curve on the Orbit Controller graph representing values of $$p$$ and $$e$$ for the given $$a$$ and $$x$$ that will result in a resonance between two selected orbital frequencies. The 'Update' button and 'Find this Ratio' checkbox are enabled/disabled when Resonance curve is on/off.
* Ratio Selection: Selection of which two directions of motion the user would like to be in resonance. This selection enables/disables the appropriate ratio integer entry boxes. Certain options in this list are also disabled for special values of the orbital parameters.
* Ratio Integers: Enter three integers representing the ratios of the respective orbital frequencies. Absolute values of frequencies are used for the case of retrograde orbits, so only positive integers are allowed. Polar and azimuthal frequencies are required to be greater than the radial frequency for all bound orbits.
* 'Find this Ratio': Checking this box will convert the draggable dot on the Controller graph into a glider that clings to the Resonance Curve when it is drawn on the graph. Un-checking the box will free the Controller dot from the curve.
* Update: Changes made to the resonance ratio will not alter the Resonance Curve seen in the Orbit Controller graph until the 'Update' button is clicked. Any choices of ratios that result in no solution will cause the Resonance Curve to disappear. Some Resonance Curves only have solutions for some values of $$e$$ and not others; in these cases, only the points with a solution will be plotted.

</details>

# Discussion

<!-- <!-- basic explanation of Kerr spacetime and the constants of motion

<!-- <!-- Wikipedia-->

<!-- Particles on a Giant Hamster Ball
<!-- Proper Time of the camera (with shift to Fermi-Walker coordinates (see  arxiv.org/abs/gr-qc/0510023)
<!--<!--
<!-- Kerr Frequencies (needs some fix): Resonances, shift to co-rotating frame phi-omegaphi_t*t
<!--clean up code

<!--The purpose of this web tool is to be an educational resource by providing visualization of the dynamics of test particles in Kerr spacetime. Many packages made to model Kerr geodesics do so by parameterizing the trajectory by the constants of motion: E, Lz, and Q. However, it can be difficult for a user to determine the combinations of values for these parameters that will result in interesting orbits. This Javascript program parameterizes trajectories in terms of the black hole spin a, semi-latus rectum p, eccentricity e, and inclination parameter x. The program dynamically calculates a parameter boundary for marginally-stable orbits. This allows the user to explore a range of stable, bound orbits. Additional features, such as Zero Angular Momentum Observers (ZAMOs), various camera options, fundamental orbital frequencies, and proper-time tracking, provide an engaging environment to help students gain intuition about geodesic motion including concepts such as frame-dragging.\\
<!--<!--a visual similar to the one I made in Mathematica may be helpful here
\\
<!--
<!-- ### FNC}
<!-- $$ \xi^{j}=sn^{j} $$
<!-- \begin{align}
<!-- g_{00}&=-(1+\frac{1}{3}R_{0p0q}(\tau)\xi^p\xi^q) +O(s^3)\\
<!-- g_{0j}&=\frac{2}{3}R_{jpq0}(\tau)\xi^p\xi^q +O(s^3)\\
<!-- g_{ij}&=\delta_{ij}-\frac{1}{3}R_{ipjq}(\tau)\xi^p\xi^q) +O(s^3)
<!-- \end{align} -->

### Outer Event Horizon and Outer Ergosphere

Displayed in the scene is the Outer Event Horizon (black surface) surrounded by the Outer Ergosphere (pale blue surface).

<!-- \cite{Visser2007}
<!-- #### Horizons}
<!--A horizon is a ...
<!-- Location where positive (outward) radial velocity with respect to local spacetime would need to be greater than the speed of light in order for a distant observer to measure a positive radial velocity, i.e., to escape. In other words, at this surface, there are no outward-pointing time-like directions, and thus all worldlines that intersect this surface must travel inward.
<!-- $$r_{\pm}=M\pm\sqrt{M^2+a^2}$$
<!-- Notice that it does not appear spherical.
<!-- See Eq. (117) of \cite{Visser2007}.
<!-- $$r_{\text{OuterH}}(\theta=0)=r_+$$
<!-- $$r_{\text{OuterH}}(\theta=\frac{\pi}{2})=\sqrt{r_+{}^2+a^2}$$

<!-- #### Ergospheres}
<!--An ergosphere is a ...
<!-- Location where negative axial velocity (retrograde w.r.t the spin of the black hole) w.r.t. local spacetime would need to be greater than the speed of light in order for a distant observer to measure a negative axial velocity. The ergosurface is also called the stationary limit, because it is the closest an observer can be to a black hole before lightspeed w.r.t local spacetime is required to appear stationary to a distant observer. In other words, the coordinate 'time' direction is no longer time-like inside the stationary limit, but becomes space-like. Unlike the event horizon, there do exist time-like directions that worldines can follow to escape the ergosphere, but they are all also co-rotating with the black hole.

<!-- $$r_{\text{Ergo}}=M\pm\sqrt{M^2-a^2\cos^2\theta}$$

<!-- <!--Sec. \ref{ZAMOs} The place where ZAMOs would-->

### Separatrix

Our code is made only to plot trajectories that don't end in either falling into the black hole or escaping to infinity. To ensure that the user only gives orbital parameter values that describe stable orbits, we must place a boundary on the input controller to separate plunging orbits from stable orbits. However, what the exact boundary for one parameter is depends on the chosen values of the others, and therefore must be calculated on the fly. The hypersurface in parameter space that defines this boundary of 'marginally stable orbits' is referred to as the _separatrix_.

As explained in \cite{Stein:2019buj} and references therein, all stable orbits have a real value for $$r_3$$ such that $$r_2-r_3>0$$. One can construct a function $$p_{sep}(a,e,x)$$ that gives the minimum value of $$p$$ for a (marginally) stable orbit, $$r_2(p,a,e,x)-r_3(p,a,e,x)\simeq 0$$.
\cite{Stein:2019buj} found what is currently the most efficient method to find and plot the separatrix. "We ... pursue an approach which yields the separatrix polynomial $$S(a, p, e, x)$$, where the separatrix lies along roots of the polynomial equation $$0 = S(a, p, e, x)$$."
For arbitrary values of $$a$$, $$e$$, and $$x$$, $$S(p)$$ is a 12th-degree polynomial.

For the code to numerically find the correct roots within a reasonable computation time and without producing errors for any combination of allowed parameter values, the algorithm alternates between various root-finding methods, many in series with or nested within others, depending on what region of the space of $$(a,e,x)$$ it is solving for.
As the user drags the $$a$$ and $$x$$ sliders, the code takes a sufficient sampling of $$e$$ values to draw a reasonably accurate spline curve from the numerical roots of $$S(p)$$.

<!-- However, the drawn line does not act as the barrier, but rather the sampling points do. So a balance between buffer size and sample density is necessary to prevent breaches while allowing for $$p$$-values that are reasonably close to the line.-->
<!-- There is also a balance between the buffer size and tolerance values to prevent the rootfinders from crashing at more difficult parameter values.-->

<!--\cite{Levin:2008yp}-->

### ZAMOs

A Zero Angular Momentum Observer (ZAMO) is an observer that follows a circular path around the spin axis of a Kerr black hole with an orbital velocity equal to the 'frame-dragging' rate of the Kerr spacetime at the radius and polar angle of the observer, thus the observer has no angular momentum.

>If one imagines spacetime to be dragged into a whirlpool-like flow by the black hole’s rotation, then the ZAMO is the observer who simply rides along with the flow.
>>\cite{Hughes:2001gg}

A very distant observer viewing a ZAMO close to the black hole sees that ZAMO moving around the black hole and would measure a mass following that observer to have orbital momentum. But in the reference frame of the ZAMO, it doesn't have any orbital momentum, because its frame is being 'dragged' at the same rate as its motion.
This makes a ZAMO a helpful reference point to see how a given trajectory is moving relative to the axial component of the flow of its local spacetime. For example, one useful demonstration with the ZAMOs displayed is to set $$e=0$$, $$x=0$$, and $$p$$ set to place the trajectory at the radius of the inner sphere of ZAMOs, and play the animation with the second camera in Trailing mode. This will show that a geodesic with invariant $$L_z=0$$ runs along side the ZAMOs.

For a ZAMO located at $$(r_Z,\theta_Z)$$, its orbital velocity as measured from a distant observer (using Boyer-Lindquist coordinates) is
$$\Omega_{ZAMO}(r_Z,\theta_Z)=\frac{2Mr_Za}{\Sigma[r_Z,\theta_Z](r_Z^2+a^2)+2Mr_Z a^2\sin^2\theta_Z}$$.  

<!-- The instantaneous phase velocities (in distant-observer coordinates, coordinate time) each have non-linear dependence on the radial and polar position.-->

<!-- <!-- \textit{Unfinished Segment}

<!-- <!-- Following \cite{Fujita:2009bp}, $$r$$ and $$\theta$$-motion are decoupled by converting to Mino time. The Mino-time frequencies
<!-- <!-- <!--for $$r$$ and $$\theta$$
<!-- <!-- are then found by integrating the equations of motion. Then they can convert back to coordinate time by dividing each by the time-coordinate's Mino-time frequency, labeled $$\Gamma$$. For example,

<!-- <!-- $$\lambda_{Mino}=\int\frac{d\tau}{\Sigma}, \;\;\;\;
<!-- <!-- \Upsilon_r= \pi \int_{r_ {\min}}^{r_ {\max}}\sqrt{R(r)}, \;\;\;\;
<!-- <!-- \Omega_r=\frac{\Upsilon_r}{\Gamma}$$
<!-- <!-- To define fundamental frequencies for a Kerr geodesic ... action-angle variable proper-time frequencies, Mino time, elliptic integrals,-->

### Orbital Frequencies

In the Keplerian model, the orbit of a small mass around a much larger massive body will remain a simple ellipse, unless there is some perturbing force between the two bodies, and this elliptical path is repeatedly traversed over a consistent period, i.e., it has an orbital frequency. The trajectory may be decomposed into repeating motion in three spatial directions: radial, polar, and azimuthal. Other effects, like perturbing forces or effects from general relativity, can separate the cycles of motion in these three directions, so they occur with differing frequencies, resulting in more complex trajectories.

In Kerr spacetime, all three orbital periods are separated. When the ratios between these periods are rational, we say they are in resonance. Resonant orbits can also be called 'closed orbits', because they have the distinct characteristic of returning to a starting point and retracing the same path after some finite integer number of orbits. These are visibly distinct from generic Kerr geodesics, which never exactly retrace a previous orbit, but over an infinite time, the path will fill a torus around the central black hole and the trajectory will fill a torus in phase space.

We have to be careful when talking about frequencies in this context, because the oscillations in these three directions do not generally follow simple harmonic motion in Cartesian coordinates. These frequencies are not necessarily identical to classical, instantaneous phase velocities. The phase growth rate in $$r$$ and $$\theta$$ are coupled, and the phase growth rates of $$\phi$$ and even coordinate time, $$t$$, are non-linear over proper time, $$\tau$$. Nevertheless, fundamental frequencies can be defined, and they can still exhibit resonances.

<!-- The instantaneous phase velocities (in distant-observer coordinates, coordinate time) each have non-linear dependence on the radial and polar position.-->

<!-- <!-- \textit{Unfinished Segment}

<!-- <!-- Following \cite{Fujita:2009bp}, $$r$$ and $$\theta$$-motion are decoupled by converting to Mino time. The Mino-time frequencies
<!-- <!-- <!--for $$r$$ and $$\theta$$
<!-- <!-- are then found by integrating the equations of motion. Then they can convert back to coordinate time by dividing each by the time-coordinate's Mino-time frequency, labeled $$\Gamma$$. For example,

<!-- <!-- $$\lambda_{Mino}=\int\frac{d\tau}{\Sigma}, \;\;\;\;
<!-- <!-- \Upsilon_r= \pi \int_{r_ {\min}}^{r_ {\max}}\sqrt{R(r)}, \;\;\;\;
<!-- <!-- \Omega_r=\frac{\Upsilon_r}{\Gamma}$$
<!-- <!-- To define fundamental frequencies for a Kerr geodesic ... action-angle variable proper-time frequencies, Mino time, elliptic integrals,-->

### Calculating Trajectories from Orbital Parameters

Details and further explanation of this math can be found in many sources. Some include \cite{Schmidt:2002qk,Drasco:2003ky,Fujita:2009bp}.

#### B-L Coordinates

The Kerr metric can be expressed as a line element. In Boyer-Lindquist coordinates, this is:

$$\begin{equation*}
    \begin{split}
        -c^{2}d\tau ^{2}={}&\;-\left(1-{\frac {2Mr}{\Sigma }}\right)c^{2}dt^{2}-{\frac {2Mra\sin ^{2}\theta }{\Sigma }}\,c\,dt\,d\phi +{\frac {\Sigma }{\Delta }}dr^{2}+\Sigma d\theta ^{2}\\
        & +\left(r^{2}+a^{2}+{\frac {2Mra^{2}}{\Sigma }}\sin ^{2}\theta \right)\sin ^{2}\theta \ d\phi ^{2}
    \end{split}
\end{equation*}$$

with $$\Delta= r^2-2Mr+a^2$$ and $$\Sigma = r^2+a^2\cos^2(\theta)$$.

The roots of this $$\Delta$$ give the locations of the inner and outer event horizons $$r_{H\pm}=M\pm\sqrt{M^2-a^2}$$.

#### Equations of Motion
<!-- Starting with the Hamiltonian,

<!-- \[H(x^{\alpha},p_{\beta})=\frac{1}{2}g^{\mu\nu}p_{\mu}p_{\nu}\]
<!-- \begin{equation*}
<!--     \begin{split}
<!--         H^{(BL)}(x^{\alpha},p_{\beta})= &
<!-- -\frac{(r^2+a^2)^2-\Delta a^2 \sin^2\theta}{2\Delta\Sigma}(p_t)^2-\frac{2aMr}{\Delta\Sigma}p_t p_{\phi}\\
<!-- &\qquad +\frac{\Delta-a^2\sin^2\theta}{2\Delta\Sigma\sin^2\theta}(p_{\phi})^2+\frac{\Delta}{2\Sigma}(p_r)^2+\frac{1}{2\Sigma}(p_{\theta})^2
<!--     \end{split}
<!-- \end{equation*}

<!-- \textit{Unfinished Segment} Finding expressions for the constants of motion: Hamilton-Jacobi equation, the characteristic function, generalized (cyclical) coord, constants of integration -->

The invariant, conserved quantities are the energy, $$E$$, the component of angular momentum parallel to the spin axis of the black hole, $$L_z$$, and what is known as the Carter's Constant, $$Q$$.
The constants of motion are calculated here by converting and adapting the Mathematica code from the Black Hole Perturbation Toolkit \citep{BHPToolkit} to Javascript, as well as math from \cite{Schmidt:2002qk}.
The code contains a series of equations for $$E$$, $$L_z$$, and $$Q$$ each written purely in terms of the orbital elements, $$(a,p,e,x)$$.

<!-- \textit{Unfinished Segment} Then to equations of motion: generalized coord., Hamilton's equations

<!-- \[\mu\frac{dX^{\alpha}}{d\tau}=\frac{\partial H^{(cyc)}}{\partial P_{\alpha}}=\textbf{J}^{\alpha}\]
<!-- \[\dot q=\partial H/\partial p,\quad
<!--      \dot p=-\partial H/\partial q \;\]
<!-- \[p_{\mu}=(-E,\pm\sqrt{R}/\Delta,\pm\sqrt{\Theta},L_z)\]

<!-- Raising the index on $$p$$, the equations of motion can be written as-->

The constants of motion need to be computed, because they appear in the equations of motion.

$$\begin{aligned}\Sigma {\frac {dr}{d\lambda }}&\;=\pm {\sqrt {R(r)}}\\\Sigma {\frac {d\theta }{d\lambda }}&\;=\pm {\sqrt {\Theta (\theta )}}\\\Sigma {\frac {d\phi }{d\lambda }}&\;=-\left(aE-{\frac {L_{z}}{\sin ^{2}\theta }}\right)+{\frac {a}{\Delta }}P(r)\\\Sigma {\frac {dt}{d\lambda }}&\;=-a\left(aE\sin ^{2}\theta -L_{z}\right)+{\frac {r^{2}+a^{2}}{\Delta }}P(r)
\end{aligned}$$  
with  
$$
\Theta (\theta )=Q-\cos ^{2}\theta \left(a^{2}\left(\mu ^{2}-E^{2}\right)+{\frac {L_{z}^{2}}{\sin ^{2}\theta }}\right)
$$  
$$
P(r)=E\left(r^{2}+a^{2}\right)-aL_{z}
$$  
$$
R(r)=P(r)^{2}-\Delta \left(\mu ^{2}r^{2}+(L_{z}-aE)^{2}+Q\right),
$$  
where $$\lambda$$  is an affine parameter such that $$\frac {dx^{\alpha }}{d\lambda }=p^{\alpha}$$. In particular, when $$\mu >0$$, the affine parameter $$\lambda$$ is related to the proper time $$\tau$$  through $$\lambda = \tau /\mu$$. Thus,  
$$d\lambda=\frac{d\tau}{\mu} \rightarrow \frac{1}{\mu^2}(\frac{d}{d\lambda})^2=\frac{\mu^2}{\mu^2}(\frac{\partial}{\partial\tau})^2.$$  
This means we can eliminate $$\mu$$-dependence from the equations of motion by switching to $$\partial\tau$$, dividing by $$\mu^2$$, and making the replacements  
$$\frac{E}{\mu}\rightarrow E,\:\frac{L_z}{\mu}\rightarrow L_z,\:\frac{Q}{\mu^2}\rightarrow Q,$$  
so we can write  
$$\begin{aligned}
\Sigma^2\left(\frac{dr}{d\tau}\right)^2&= R(r)\\
\Sigma^2\left(\frac{d\theta}{d\tau}\right)^2&= \Theta(\theta) \\
\Sigma\frac{d\phi}{d\tau} &=\frac{a}{\Delta}(2rE - aL_z) + \frac{L_z}{\sin^2\theta}\\
\Sigma\frac{dt}{d\tau} &=\frac{1}{\Delta}\left((r^2 + a^2)^2E - 2arL_z\right)- a^2E \sin^2\theta,
\end{aligned}$$  
where  
$$\begin{aligned}
R(r) &= - \beta r^4 + 2r^3 - (a^2\beta + L_z^2)r^2+ 2(aE - L_z)^2r - Q\Delta \\
\Theta(\theta) &= Q - \cos^2\theta\left(a^2\beta + \frac{L_z^2}{\sin^2\theta}\right)
\end{aligned}$$  
and $$\beta = (1 - E^2)$$. In the above equations and hereafter $$E$$, $$L_z$$, and $$Q$$ denote the_specific_ energy, angular momentum and Carter constant, respectively.

#### Solutions in Cyclical Coordinates

We are limiting the trajectories to stable orbits, which means that both motion in the latitudinal, $$\theta$$, and radial, $$r$$, directions oscillate between minimum and maximum values, and $$\phi$$ always increases. As described above, the extrema of these variables are fixed by the orbital parameters. However, unlike simple, closed, elliptical orbits, the periods of oscillation for these directions are not necessarily the same as the azimuthal (or orbital) period.
With these conditions, computation becomes much simpler if we define three phase angles to track cyclical motion in the three spatial directions: $$(r,\theta,\phi)\rightarrow(\xi,\chi,\phi)$$ that each cycle through $$[0,2\pi]$$ according to their own equations of motion.

##### Latitudinal Motion

First, we find it convenient to change variables $$\theta \mapsto u$$.  
$$\begin{align}
u(\lambda) & =\cos{\theta(\lambda)}=u_0\sin{\chi(\lambda)}\\
\dot{u} & =-\dot{\theta}\sin{\theta}=u_0\dot{\chi}\cos{\chi}\\
\dot{\theta}^2 &= \frac{\dot{u}^2}{(1-\cos^2\theta)}=\frac{\dot{u}^2}{1-u^2}\\
\dot{u}^2 &= \dot{\chi}^2\left[u_0^2-u_0^2\sin^2\chi\right]\\
&=(u_0^2-u^2)\dot{\chi}^2.
\end{align}$$  
From here, we can set up the equation of motion for $$u$$ and convert it into an equation for $$\chi$$ that is only in terms of the roots $$u_0$$ and $$u_1$$, i.e., $$u$$ can be eliminated,  
$$\begin{align}
  \Sigma^2\dot{u}^2 &= a^2(1-E^2)(u^2-u_0^2)(u^2-u_1^2)\\
  \Sigma^2(u_0^2-u^2)\dot{\chi}^2 &= a^2(1-E^2)(u^2-u_0^2)(u^2-u_1^2)\\
  \Sigma^2\dot{\chi}^2 &= -(1-E^2)(a^2u^2-a^2u_1^2)\\
  \dot{\chi} &= \pm \frac{a}{\Sigma} \sqrt{u^2 - u_1^2}= \pm \frac{a}{r^2 + a^2 u_0^2 \sin^2 \chi} \sqrt{u_0^2 \sin^2 \chi - u_1^2}
\end{align}$$
$$\begin{equation}
  \dot{\chi}=\frac{a}{\Sigma}\sqrt{(1-E^2)(u_1^2-u^2)}.
\end{equation}$$  
Now we are just left with determining the values of $$u_0$$ and $$u_1$$.

##### Latitudinal Roots

$$\begin{align}
\Sigma^2\dot{\theta}^2 &= Q-\left( \frac{L_z^2}{(1-\cos^2\theta)} + (1-E^2)a^2 \right)\cos^2\theta\\
\Sigma^2\dot{u}^2 &= (1-u^2) \left[Q- \frac{L_z^2u^2}{(1-u^2)} - (1-E^2)a^2u^2 \right]\\
&= u^4(1-E^2)a^2+u^2\biggl(-Q-L_z^2-(1-E^2)a^2\biggr)+Q
\end{align}$$  
The boundaries of motion are found where the velocities are zero,  
$$\begin{align}
0 &= (u^2)^2a^2-\left(a^2+\frac{Q}{(1-E^2)}+\frac{L_z^2}{(1-E^2)}\right)u^2+\frac{Q}{(1-E^2)}\\
 &= (u^2)^2a^2-\left(a^2+q+\Phi^2\right)u^2+q,
\end{align}$$  
where $$q=\frac{Q}{(1-E^2)}$$ and $$\Phi^2=\frac{L_z^2}{(1-E^2)}$$.  
The solution to this quadratic equation in $$u^2$$ is  
$$\begin{equation}\label{eq:uroots}
    u^2=\cos^2\theta_{\min} \text{ or } \theta_{\max}=\frac{1}{2a^2}\left((a^2+q+\Phi^2) \pm \sqrt{(a^2+q+\Phi^2)^2-4a^2q}\right).
\end{equation}$$  
To help us to identify which solution corresponds to $$u_0$$ and which to $$u_1$$ it is informative to observe what happens when we let $$\Phi\rightarrow0$$  
$$\begin{align}
    u^2&=\frac{1}{2a^2}\left(a^2+q \pm \sqrt{(a^2)^2+2a^2q+q^2-4a^2q}\right)\\
    &=\frac{1}{2a^2}\left((a^2+q) \pm \sqrt{(a^2-q)^2}\right) =\frac{1}{2a^2}\left((a^2+q) \pm (a^2-q)\right)\\
    &=\frac{1}{2a^2}\left(2a^2 \text{ or } 2q\right) = 1\text{ or }\frac{q}{a^2}
\end{align}$$  
We find that the first root must be $$u_0^2=1$$ and the second $$u_1^2=\frac{q}{a^2}>0$$.  
<!--(Someone proved for some condition that $$q>0$$) -->
To have a non-imaginary result, $$u_1>1$$ and $$u^2$$ must vary between 0 and 1. Thus, upon inspection, we can identify $$u_0=z_m=\sqrt{1-x^2}$$ and rewrite equation for $$u^2$$ as  
$$\begin{equation}\label{eq:uroots2}
    a^2u_{0,1}^2=\frac{1}{2}\left((a^2+q+\Phi^2) \mp \sqrt{(a^2+q+\Phi^2)^2-4a^2q}\right).
\end{equation}$$  
Moving the coefficient $$a^2$$ to the left-hand side helps computationally for cases where $$a=0$$.

##### Radial Motion

Since we are limiting the trajectories to bound orbits, the radial motion is also cyclical, oscillating between two roots of the radial equation, labelled $$r_1=r_{\max}=\frac{pM}{1-e}$$ and $$r_2=r_{\min}=\frac{pM}{1+e}$$. However, the radial equation actually has four roots. So when we replace $$r$$ with a cyclical coordinate, $$\xi$$, we expect the result to have terms still containing the constants $$r_3$$ and $$r_4$$.  
$$\begin{align}
    r(\lambda)&=\frac{pM}{1+e\cos{\xi(\lambda)}}=\tilde{r}M\\
    \dot{r}&=\frac{p e \sin{\xi}\dot{\xi}M}{(1+e\cos{\xi})^2}=\dot{\tilde{r}}M\\
    \Sigma&=r^2+a^2u_0^2\sin^2\chi\\
    \Delta&=r^2-2Mr+a^2\\
    P&=E(r^2+a^2)-a L_z\\
    R(r)&=(1-E^2)(r_1-r)(r-r_2)(r-r_3)(r-r_4)\\
    \Sigma^2\dot{r}^2\rightarrow\Sigma^2\dot{\xi}^2&=R(r)\frac{(1+e\cos{\xi})^2}{p^2e^2\sin^2\xi}\\
    &=\frac{1-E^2}{1-e^2}(1+e\cos\xi)^2(r-r_3)(r-r_4).
\end{align}$$

##### Radial Roots

$$R(r)=(1-E^2)(r_1-r)(r-r_2)(r-r_3)(r-r_4)$$  
$$r_1$$ and $$r_2$$ are already known. To find $$r_3$$ and $$r_4$$, we follow the path of \cite{Fujita:2009bp}.  
$$
\begin{gather}
\begin{split}
r_3=\frac{(A+B)+\sqrt{(A+B)^2-4AB}}{2},\;\; r_4=\frac{AB}{r_3},\\
A+B=\frac{2M}{1-E^2}-(r_1+r_2),\;\; AB=\frac{a^2Q}{(1-E^2)r_1r_2}.
\end{split}
\end{gather}
$$  

