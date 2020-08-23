---
layout: post
title: Single Shot Multi-box Detector
categories : [ Research ]
tagline: "for object recognition"
author : Gompanghee
keywords: SSD, Single shot Multi-box Detector, Object Detection, Object Recognition
bgcolor: 292929
---
{% include JB/setup %}

안녕하세요. 제 Git Page의 첫 게시물로 SSD(Single shot Multi-box Detector)에 대한 포스팅을 해보려 합니다.

1년 전(2019년) SSD에 대해 궁금한 것이 너무 많았지만 상세한 자료를 찾는게 쉽지 않았습니다.

특히 한국어로 번역된 자료는 매우 드물었기에 직접 공부해서 한국어 포스트를 작성하기로 마음 먹었고, 지금에서야 포스트를 쓸 수 있게 되었습니다.

이 글에서는 SSD 논문과 해외 여러 포스트, 저서들을 토대로 아주 상세한 내용을 다뤄보고 이를 직접 구현한 코드를 해설해보겠습니다.
>> 인공지능에 입문하는 분, 수학을 잘 모르시는 분도 읽기 쉽게 준비했습니다.



## 서론 : 단계별 사물 인식

시작하기에 앞서, 이미지 인식은 목적에 따라 세 단계로 나눌 수 있습니다. 

영어로는 세 단계가 확실히 구분되지만, 한국어로는 대부분 '인식'으로 번역할 수 있기 때문에 자료 수집에 혼란이 되었던 부분입니다. 

그러므로 목적에 따라 키워드를 구분해 사용하는 것이 좋습니다.

> 1. 하나의 이미지 전체가 어떤 사물을 표현하는 것인지 분류하는 'Classification'
> 2. 하나의 이미지에 어떤 사물들이 표현되어 있는지 식별하는 'Recognition'
> 3. 하나의 이미지에 사물들이 어떤 형태를 가지고 있는지 분리하는 'Segmentation'

이 중 'Classification'과 'Recognition'을 묶어 'Detection'이라는 키워드를 사용할 수 있습니다.

쉬운 이해를 위해 그림으로 표현하면 이렇습니다.

![인식의 종류](/assets/img/Detections.png)

Classification은 이미지를 전체적으로 인식하고, Recognition은 이미지에 표현된 여러가지 개체를 인식하며, Segmentation은 이미지에 표현된 개체들의 경계까지 인식합니다.

즉, SSD는 사물을 박스로 추측하기 때문에 한 이미지에 표현된 여러 사물들을 식별해내기 위한 Recognition 모델입니다.