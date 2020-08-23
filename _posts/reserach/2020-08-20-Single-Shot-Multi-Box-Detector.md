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



## 서론 I : 단계별 사물 인식

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



## 서론 II : Classification의 원리와 Recognition의 어려움

Classification은 CNN의 기본 원리인 Sliding Window 탐색 기법으로 이미지에 (인공지능의 입장에서)원하는 픽셀에 영향력을 강하게 주어 이미지를 분류하는 기준을 정하도록 학습하는 원리를 갖고 있습니다.

즉, 이미지가 어떤 특징을 담고 있는지는 분석할 수 있지만 신경망을 통해 얻어낸 특징이 이미지에서 어떤 좌표를 통해 얻어낸 특징인지는 알 수 없습니다. 물론 역추적 마스킹을 통해 어느정도 특징을 발생시킨 픽셀을 추측할 순 있지만 해당 픽셀이 정확히 어떤 개체를 의미하는지는 알아낼 수 없습니다.

그러므로 일반적인 구조의 CNN을 이용해서 한 번에 여러 개체의 위치를 찾아 식별하는 것은 매우 힘든일입니다.

그렇기에 SSD를 통해 신경망은 복잡해지지만 인식 성능과 동작 속도가 빠른 새로운 구조를 제안하고 있습니다.



## 개요 : 전체적인 SSD 구조

SSD의 구조는 크게 2개의 신경망이 연결되어있는 구조입니다. 입력을 받아 이미지의 수 많은 특징을 추출해내는 신경망을 'Core Network', 이미지의 특징을 받아 Box를 추측해내는 신경망을 'Bounding Box Network(이하 BBox Network)'라고 해보겠습니다.
논문에 실린 이미지를 인용해서 이 개념을 표현해보자면 이렇습니다.

[그림]

Core Network에서 이미지의 특징을 충분히 추출하고, BBox Network에서 여러가지 크기의 Box를 추측하는 구조로 되어있습니다. 이 말은 즉, Core Network는 분리될 수 있기에 어떤 신경망으로든 대체가능하며 BBox Network는 Box를 추측하는 도구로써 사용됩니다. 그렇기에 Core Network에서 얼마나 정밀하고 빠르게 특징을 추출하냐에 따라 SSD의 성능이 좌우된다고 할 수 있습니다.

요컨대, Core Network는 교체가 가능하고 그 성능에 따라 Box 추측 성능이 달라질 수 있다는 말이 됩니다.

그러므로 같은 SSD 모델이라도 Inception을 사용하는 모델과 MobileNet을 사용하는 모델의 성능과 속도 차이가 발생하는 것입니다.

>> SSD 모델명은 SSD_Inception_500... 또는 SSD_MobileNet_300... 등과 같이 표현합니다. SSD_Inception_500...은 입력을 500x500 사이즈로 받고 'SSD'를 BBox Network로 Wrapping한 Inception 모델이라는 뜻이며, SSD_MobileNet_300은 입력을 300x300 사이즈로 받고 'SSD'를 BBox Network로 Wrapping한 MobileNet 모델이라는 뜻입니다. YOLO_Inception도 같은 맥락으로 Inception을 'YOLO'를 BBox Network로 Wrapping 했다는 뜻이 됩니다.)