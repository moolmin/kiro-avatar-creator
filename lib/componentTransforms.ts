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
      scale: 0.24,
      translateX: 2040,
      translateY: 1180,
    },
    'eyes-02': {
      scale: 0.24,
      translateX: 2040,
      translateY: 1180,
    },
    'eyes-03': {
      scale: 0.3,
      translateX: 1540,
      translateY: 860,
    },
    'eyes-04': {
      scale: 0.3,
      translateX: 1540,
      translateY: 800,
    },
    'eyes-05': {
      scale: 0.25,
      translateX: 1940,
      translateY: 1100,
    },
    'eyes-06': {
      scale: 0.3,
      translateX: 1540,
      translateY: 800,
    },
    'eyes-07': {
       scale: 0.3,
      translateX: 1540,
      translateY: 800,
    },
  },

  // Hats 카테고리
  hats: {
    'hat-01': {
      scale: 0.4,
      translateX: 1100,
      translateY: -300,
    },
    'hat-02': {
      scale: 0.44,
      translateX: 340,
      translateY: -280,
    },
    'hat-03': {
      scale: 0.44,
      translateX: 340,
      translateY: -280,
    },
    'hat-04': {
      scale: 0.7,
      translateX: 260,
      translateY: -480,
    },
    'hat-05': {
      scale: 0.34,
      translateX: 1080,
      translateY: -280,
    },
    'hat-06': {
      scale: 0.7,
      translateX: 340,
      translateY: -350,
    },
  },

  // Capes 카테고리
  capes: {
    'capes-01': {
      scale: 1.02,
      translateX: -36,
      translateY: 168,
    },
    'capes-02': {
      scale: 0.96,
      translateX: -26,
      translateY: 200,
    },
    'capes-03': {
      scale: 0.98,
      translateX: -24,
      translateY: 176,
    },
    'capes-04': {
      scale: 1.015,
      translateX: -57,
      translateY: 170,
    },
  },

  // Accessories 카테고리
  accessories: {
    'accessories-01': {
      scale: 0.4,
      translateX: 1040,
      translateY: 1200,
    },
    'accessories-02': {
      scale: 0.4,
      translateX: 1040,
      translateY: 1200,
    },
    'accessories-03': {
       scale: 0.84,
      translateX: 140,
      translateY: 200,
    },
    'accessories-04': {
      scale: 0.3,
      translateX: 1560,
      translateY: 1400,
    },
    'accessories-05': {
      scale: 1.42,
      translateX: -164,
      translateY: -260,
    },
    'accessories-06': {
      scale: 0.18,
      translateX: 2900,
      translateY: 2800,
    },
    'accessories-07': {
      scale: 0.36,
      translateX: 1700,
      translateY: 1600,
    },
    'accessories-08': {
      scale: 0.4,
      translateX: 1000,
      translateY: 700,
    },
    'accessories-09': {
      scale: 0.36,
      translateX: 1800,
      translateY: 1600,
    },
    'accessories-10': {
      scale: 0.8,
      translateX: 500,
      translateY: 240,
    },
  },

  // Backgrounds 카테고리
  backgrounds: {
    'background-00': {
      scale: 1.0,
      translateX: 0,
      translateY: 0,
    },
    'background-01': {
      scale: 1.0,
      translateX: 0,
      translateY: 0,
    },
    'background-02': {
      scale: 1.0,
      translateX: 0,
      translateY: 0,
    },
    'background-03': {
      scale: 1.0,
      translateX: 0,
      translateY: 0,
    },
    'background-04': {
      scale: 1.0,
      translateX: 0,
      translateY: 0,
    },
    'background-05': {
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