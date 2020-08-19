---
layout: post
title: SSD(Single Shot Multi-box Detector)
categories : [ Research ]
tags : [jekyll, code]
tagline: "for object recognition"
author : Gompanghee
keywords: SSD, Single shot Multi-box Detector, Object Detection, Object Recognition
bgcolor: 292929
---
{% include JB/setup %}

<!--{% include post-side-bar.html %}-->

안녕하세요. 제 Git Page의 첫 게시물로 SSD(Single shot Multi-box Detector)에 대한 포스팅을 해보려 합니다.

1년 전(2019년) SSD에 대해 궁금한 것이 너무 많았지만 상세한 자료를 보는게 쉽지 않았습니다.

특히 한국어로 번역된 자료는 매우 드물었기에 직접 공부해서 한국어 포스트를 작성하기로 마음 먹었습니다.

이 글에서는 SSD 논문과 해외 여러 포스트, 저서들을 토대로 아주 상세한 내용까지 다뤄보겠습니다.
>> 인공지능에 입문하는 분, 수학을 잘 모르시는 분도 읽기 쉽게 준비했습니다.

# 서론 : 사물 인식(Object Detection)

사물 인식은 크게 세가지 방식으로 나눌 수 있습니다.

첫 번째로 이미지 전체를 인식해 하나의 이미지로 표현하는 개체가 어떤 것인지 분류하는 Object Detection이 있습니다.

