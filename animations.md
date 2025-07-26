---
layout: default
title: Animations
permalink: /animations/
---

<script src="{{ '/assets/js/animation-viewer.js' | relative_url }}" defer></script>

<h1>Animations</h1>

<script>
  window.animationsData = [
    {% for animation in site.data.animations %}
      {
        filename: "{{ site.r2_base_url }}{{ animation.filename | escape }}"
      }{% if forloop.last == false %},{% endif %}
    {% endfor %}
  ];
</script>

{% include animations-gallery.html %}
{% include animation-viewer.html %}
