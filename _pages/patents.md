---
layout: page
permalink: /patents/
title: patents
description: # My patents listed in reverse chronological order
nav: true
nav_order: 3
---

<!-- _pages/patents.md -->

<div class="publications">

    {% bibliography --query @*[type=patent]* %}

</div>
