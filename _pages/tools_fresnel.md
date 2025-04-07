---
layout: page
permalink: /tools_fresnel/
title: Fresnel Reflection Calculator
description: Calculates Fresnel reflection coefficients.
nav: false
---

<div id="fresnel-app">
  <fresnel-calculator></fresnel-calculator>
</div>

<script src="https://cdn.jsdelivr.net/npm/vue@3.2.31/dist/vue.global.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/chart.js@3.7.0/dist/chart.min.js"></script>
<script src="/assets/js/fresnel-calculator.js"></script>

<style>
.fresnel-calculator {
  margin: 20px 0;
}
.card {
  margin-bottom: 20px;
}
</style>

## Fresnel Equations

Here are the Fresnel equations used to calculate the reflectivity. 


$$
{\displaystyle R_{\mathrm {s} }=\left|{\frac {n_{1}\cos \theta _{\mathrm {i} }-n_{2}\cos \theta _{\mathrm {t} }}{n_{1}\cos \theta _{\mathrm {i} }+n_{2}\cos \theta _{\mathrm {t} }}}\right|^{2}=\left|{\frac {n_{1}\cos \theta _{\mathrm {i} }-n_{2}{\sqrt {1-\left({\frac {n_{1}}{n_{2}}}\sin \theta _{\mathrm {i} }\right)^{2}}}}{n_{1}\cos \theta _{\mathrm {i} }+n_{2}{\sqrt {1-\left({\frac {n_{1}}{n_{2}}}\sin \theta _{\mathrm {i} }\right)^{2}}}}}\right|^{2}}
$$


$$
{\displaystyle R_{\mathrm {p} }=\left|{\frac {n_{1}\cos \theta _{\mathrm {t} }-n_{2}\cos \theta _{\mathrm {i} }}{n_{1}\cos \theta _{\mathrm {t} }+n_{2}\cos \theta _{\mathrm {i} }}}\right|^{2}=\left|{\frac {n_{1}{\sqrt {1-\left({\frac {n_{1}}{n_{2}}}\sin \theta _{\mathrm {i} }\right)^{2}}}-n_{2}\cos \theta _{\mathrm {i} }}{n_{1}{\sqrt {1-\left({\frac {n_{1}}{n_{2}}}\sin \theta _{\mathrm {i} }\right)^{2}}}+n_{2}\cos \theta _{\mathrm {i} }}}\right|^{2}}
$$
