import React from 'react';
import { Text, View } from 'react-native';

const TextoComExpoente = ({ texto, style }: any) => {
  const partes = texto.split(/(\^\d+)/);

  return (
    <Text
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
      }}
    >
      {partes.map((parte: any, index: any) => {
        if (parte.startsWith('^')) {
          return (
            <Text
              key={index}
              style={[
                style,
                {
                  fontSize: style.fontSize * 0.6, // Smaller font size for the exponent
                  lineHeight: style.lineHeight, // Same line height for consistency
                  marginLeft: -style.fontSize * 0.1, // Reduce the gap between base text and exponent
                  marginTop: -style.fontSize * 0.3, // Lift the exponent slightly above
                },
              ]}
            >
              {parte.slice(1)}
            </Text>
          );
        }
        return (
          <Text key={index} style={style}>
            {parte}
          </Text>
        );
      })}
    </Text>
  );
};

export default TextoComExpoente;
