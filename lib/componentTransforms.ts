/**
 * SVG Transform Configuration
 * 
 * 각 SVG 파일별로 크기(scale)와 위치(translate)를 개별적으로 관리합니다.
 * 이곳에서 모든 SVG 파일들의 위치와 크기를 조정할 수 있습니다.
 */

export interface SVGTransform {
  scale: number;
  translateX: number;
  translateY: number;
}

export interface SVGTransformConfig {
  [category: string]: {
    [svgFileName: string]: SVGTransform;
  };
}

/**
 * SVG별 transform 설정 (파일명 기준)
 */
export const svgTransforms: SVGTransformConfig = {
  // Ghost Body (기본 몸통) - 고정
  ghostBody: {
    'kiro-body': {
      scale: 0.54,
      translateX: 280,
      translateY: 180,
    },
  },

  // Eyes 카테고리
  eyes: {
    'eyes-01': {
      scale: 0.3,
      translateX: 1600,
      translateY: 1000,
    },
    'eyes-02': {
      scale: 0.3,
      translateX: 1600,
      translateY: 1000,
    },
    'eyes-03': {
      scale: 0.45,
      translateX: 1020,
      translateY: 650,
    },
    'eyes-04': {
      scale: 0.32,
      translateX: 1380,
      translateY: 800,
    },
    'eyes-05': {
      scale: 1.0,
      translateX: 0,
      translateY: 0,
    },
    'eyes-06': {
       scale: 0.24,
      translateX: 1940,
      translateY: 1200,
    },
    'eyes-07': {
      scale: 0.22,
      translateX: 1940,
      translateY: 1260,
    },
    'eyes-08': {
     scale: 0.23,
      translateX: 1900,
      translateY: 1280,
    },
  },

  // Hats 카테고리
  hats: {
    'witch-hat': {
      scale: 1.0,
      translateX: 0,
      translateY: 0,
    },
    'pumpkin-hat': {
      scale: 1.0,
      translateX: 0,
      translateY: 0,
    },
  },

  // Capes 카테고리
  capes: {
    'white-cape': {
      scale: 1.0,
      translateX: 0,
      translateY: 0,
    },
    'purple-cape': {
      scale: 1.0,
      translateX: 0,
      translateY: 0,
    },
    'black-cape': {
      scale: 1.0,
      translateX: 0,
      translateY: 0,
    },
    'capes-01': {
      scale: 0.352,
      translateX: -104,
      translateY: 920,
    },
  },

  // Accessories 카테고리
  accessories: {
    'wand': {
      scale: 1.0,
      translateX: 0,
      translateY: 0,
    },
    'pumpkin-basket': {
      scale: 1.0,
      translateX: 0,
      translateY: 0,
    },
    'candy': {
      scale: 1.0,
      translateX: 0,
      translateY: 0,
    },
  },

  // Backgrounds 카테고리
  backgrounds: {
    'sparkles': {
      scale: 1.0,
      translateX: 0,
      translateY: 0,
    },
    'moon': {
      scale: 1.0,
      translateX: 0,
      translateY: 0,
    },
  },
};

/**
 * 특정 SVG 파일의 transform 값을 가져옵니다
 */
export function getSVGTransform(
  category: string, 
  svgFileName?: string
): SVGTransform {
  if (!svgFileName) {
    return { scale: 1.0, translateX: 0, translateY: 0 };
  }

  // .svg 확장자 제거
  const cleanFileName = svgFileName.replace('.svg', '');
  
  const categoryConfig = svgTransforms[category];
  
  if (!categoryConfig) {
    return { scale: 1.0, translateX: 0, translateY: 0 };
  }

  // 특정 SVG 파일 설정이 있는 경우
  if (categoryConfig[cleanFileName]) {
    return categoryConfig[cleanFileName];
  }

  // 기본값 반환
  return { scale: 1.0, translateX: 0, translateY: 0 };
}

/**
 * Transform 값을 SVG transform 문자열로 변환합니다
 */
export function transformToString(transform: SVGTransform): string {
  const { scale, translateX, translateY } = transform;
  
  let transformString = '';
  
  if (scale !== 1.0) {
    transformString += `scale(${scale})`;
  }
  
  if (translateX !== 0 || translateY !== 0) {
    if (transformString) transformString += ' ';
    transformString += `translate(${translateX}, ${translateY})`;
  }
  
  return transformString;
}