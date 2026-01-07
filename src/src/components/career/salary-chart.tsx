import { Canvas, DashPathEffect, Path, Skia } from "@shopify/react-native-skia";
import React, { useMemo, useState } from "react";
import { View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import Heading from "../ui/heading";

type Props = {
  min: number;
  max: number;
  currency: string;
  height?: number;
  peakRatio?: number; // 0..1 of chart height above the baseline
  curvature?: number; // 0..0.5 handle length as % of width
};

// Tasa de cambio USD a GTQ (aproximada, puede ajustarse)
const USD_TO_GTQ_RATE = 7.8;

// Convierte USD anual a GTQ mensual
function convertUSDAnnualToGTQMonthly(usdAnnual: number): number {
  const usdMonthly = usdAnnual / 12;
  return usdMonthly * USD_TO_GTQ_RATE;
}

// Formatea números con separadores de miles
function formatNumber(num: number): string {
  return Math.round(num).toLocaleString("es-GT");
}

export default function SalaryChart({
  min,
  max,
  currency,
  height = 150,
  peakRatio = 0.55, // how tall the peak is
  curvature = 0.18, // how "arched" the curve looks
}: Props) {
  const [w, setW] = useState(0);

  const { theme } = useUnistyles();

  // Convertir a GTQ mensual si la moneda es USD
  let displayMin = min;
  let displayMax = max;
  let symbol = "Q";
  let periodLabel = "mensual";

  if (currency === "USD") {
    displayMin = convertUSDAnnualToGTQMonthly(min);
    displayMax = convertUSDAnnualToGTQMonthly(max);
    symbol = "Q";
    periodLabel = "mensual";
  } else if (currency === "EUR") {
    symbol = "€";
  } else if (currency === "GBP") {
    symbol = "£";
  } else if (currency === "GTQ") {
    symbol = "Q";
    periodLabel = "mensual";
  }

  const { strokePath, fillPath } = useMemo(() => {
    if (w === 0) return { strokePath: undefined, fillPath: undefined };

    const padX = 12;
    const startX = padX;
    const endX = w - padX;
    const midX = (startX + endX) / 2;

    const baseY = height - 10; // baseline at bottom
    const peakY = baseY - height * peakRatio; // peak near top

    // Handle lengths
    const span = endX - startX;
    const edgeH = span * curvature; // near edges
    const midH = span * curvature; // near middle

    // Segment 1: start -> mid
    // C0 keeps start tangent horizontal; C1 sits at peakY to flatten at the top
    const p = Skia.Path.Make();
    p.moveTo(startX, baseY);
    p.cubicTo(
      startX + edgeH,
      baseY, // C0
      midX - midH,
      peakY, // C1 (left of mid, same Y as peak)
      midX,
      peakY // Mid point
    );
    // Segment 2: mid -> end
    // Mirror the mid control and the edge control for smoothness
    p.cubicTo(
      midX + midH,
      peakY, // C2 (right of mid, same Y as peak)
      endX - edgeH,
      baseY, // C3
      endX,
      baseY // End point
    );

    const fill = p.copy();
    // Close to baseline for area fill
    fill.lineTo(endX, baseY);
    fill.lineTo(startX, baseY);
    fill.close();

    return { strokePath: p, fillPath: fill };
  }, [w, height, peakRatio, curvature]);

  return (
    <View
      onLayout={e => setW(Math.round(e.nativeEvent.layout.width))}
      style={{
        width: "100%",
        position: "relative",
        marginTop: theme.gap(2),
      }}
    >
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          alignItems: "center",
          justifyContent: "flex-start",
          pointerEvents: "none",
        }}
      >
        <Heading
          level={6}
          color="secondary"
        >{`Salario medio ${periodLabel}`}</Heading>
        <Heading
          level={4}
        >{`${symbol}${formatNumber((displayMin + displayMax) / 2)}`}</Heading>
      </View>
      <Canvas style={{ width: w, height }}>
        {fillPath && (
          <Path path={fillPath} style="fill" color={theme.colors.tintDimmed} />
        )}
        {strokePath && (
          <Path
            path={strokePath}
            style="stroke"
            strokeWidth={2}
            strokeCap="round"
            color={theme.colors.tint}
          />
        )}
        {/* Create vertical line from (half,0) to (half,height) */}
        {w > 0 &&
          (() => {
            const verticalLine = Skia.Path.Make();
            verticalLine.moveTo(w / 2, height - height * 0.7);
            verticalLine.lineTo(w / 2, height);
            return (
              <Path
                path={verticalLine}
                style="stroke"
                strokeWidth={2}
                strokeCap="round"
                color={theme.colors.label}
              >
                <DashPathEffect intervals={[4, 4]} />
              </Path>
            );
          })()}
      </Canvas>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: -2,
        }}
      >
        <Heading
          level={6}
          color="secondary"
        >{`${symbol}${formatNumber(displayMin)}`}</Heading>
        <Heading
          level={6}
          color="secondary"
        >{`${symbol}${formatNumber(displayMax)}`}</Heading>
      </View>
    </View>
  );
}
