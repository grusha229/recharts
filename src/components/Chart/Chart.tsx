import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { EDGE_Z_SCORE_COLOR, EDGE_Z_SCORE_VALUE, getFinalZScorePosition, getInitialZScorePosition, getMeanByKey, getStandardDeviationByKey, GRAPH_DATA } from "./Chart.utils";
import ChartDot from "./ChartDot";
import { Payload } from "recharts/types/component/DefaultLegendContent";
import ChartTooltip from "./ChartTooltip";

export interface ILineZScoreConfig {
  mean: number,
  deviation: number,
  startPosition: number,
  finalPosition: number,
  color: string
}

export default function Chart() {

    const UVGraphConfig = useMemo<ILineZScoreConfig>(() => {
      const mean = getMeanByKey(GRAPH_DATA, "uv");
      const deviation = getStandardDeviationByKey(GRAPH_DATA, "uv");

      const startIndex = (getInitialZScorePosition('uv', mean, deviation) !== -1)
        ? getInitialZScorePosition('uv', mean, deviation)
        : 0;

      const endIndex = (getFinalZScorePosition('uv', mean, deviation) !== -1)
        ? getFinalZScorePosition('uv', mean, deviation)
        : 0;

      const startPosition = startIndex / (GRAPH_DATA.length - 1) * 100;
      const finalPosition = endIndex / (GRAPH_DATA.length - 1) * 100;

      return {
        mean,
        deviation,
        startPosition,
        finalPosition,
        color: '#8884d8'
      }
    }, [GRAPH_DATA])

    const PVGraphConfig = useMemo<ILineZScoreConfig>(() => {
      const mean = getMeanByKey(GRAPH_DATA, "pv");
      const deviation = getStandardDeviationByKey(GRAPH_DATA, "pv");

      const startIndex = (getInitialZScorePosition('pv', mean, deviation) !== -1)
        ? getInitialZScorePosition('pv', mean, deviation)
        : 0;

      const endIndex = (getFinalZScorePosition('pv', mean, deviation) !== -1)
        ? getFinalZScorePosition('pv', mean, deviation)
        : 0;

      const startPosition = startIndex / (GRAPH_DATA.length - 1) * 100;
      const finalPosition = endIndex / (GRAPH_DATA.length - 1) * 100;

      return {
        mean,
        deviation,
        startPosition,
        finalPosition,
        color: '#82ca9d'
      }
    }, [GRAPH_DATA])

    const legendPayload: Payload[] = [
      {
        type: 'line',
        value: 'uv',
        color: UVGraphConfig.color,
      },
      {
        type: 'line',
        value: 'pv',
        color: PVGraphConfig.color,
      },
      {
        type: "square",
        value: `Зона с Z-Score больше ${EDGE_Z_SCORE_VALUE}`,
        color: EDGE_Z_SCORE_COLOR,
      }
    ]

    return (
      <>
        <ResponsiveContainer width={600} height={300}>
            <LineChart data={GRAPH_DATA} margin={{ top: 20 }} accessibilityLayer>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <defs>
                  <linearGradient id="uvGradient">
                    <stop offset="0%" stopColor={UVGraphConfig.color} />
                    {(UVGraphConfig.startPosition !== UVGraphConfig.finalPosition) && ( 
                        <>
                          <stop offset={`${UVGraphConfig.startPosition}%`} stopColor={UVGraphConfig.color} />
                          <stop offset={`${UVGraphConfig.startPosition}%`} stopColor={EDGE_Z_SCORE_COLOR} />
                          <stop offset={`${UVGraphConfig.finalPosition}%`} stopColor={EDGE_Z_SCORE_COLOR} />
                          <stop offset={`${UVGraphConfig.finalPosition}%`} stopColor={UVGraphConfig.color} />
                        </>
                    )}
                    <stop offset="100%" stopColor={UVGraphConfig.color} />
                  </linearGradient>

                  <linearGradient id="pvGradient">
                    <stop offset="0%" stopColor={PVGraphConfig.color} />
                    <stop offset={`${PVGraphConfig.startPosition}%`} stopColor={PVGraphConfig.color} />
                    <stop offset={`${PVGraphConfig.startPosition}%`} stopColor={EDGE_Z_SCORE_COLOR} />
                    <stop offset={`${PVGraphConfig.finalPosition}%`} stopColor={EDGE_Z_SCORE_COLOR} />
                    <stop offset={`${PVGraphConfig.finalPosition}%`} stopColor={PVGraphConfig.color} />
                    {(PVGraphConfig.startPosition !== PVGraphConfig.finalPosition) && (
                        <>
                        <stop offset={`${PVGraphConfig.startPosition}%`} stopColor={PVGraphConfig.color} />
                        <stop offset={`${PVGraphConfig.startPosition}%`} stopColor={EDGE_Z_SCORE_COLOR} />
                        <stop offset={`${PVGraphConfig.finalPosition}%`} stopColor={EDGE_Z_SCORE_COLOR} />
                        <stop offset={`${PVGraphConfig.finalPosition}%`} stopColor={PVGraphConfig.color} />
                      </>
                    )}
                    <stop offset="100%" stopColor={PVGraphConfig.color} />
                  </linearGradient>
                </defs>
                <YAxis />
                <Tooltip content={<ChartTooltip />} />
                <Line
                  type="monotone"
                  dataKey="pv"
                  stroke="url(#pvGradient)"
                  color={PVGraphConfig.color}
                  dot={
                    <ChartDot
                      mean={PVGraphConfig.mean}
                      deviation={PVGraphConfig.deviation}
                      color={PVGraphConfig.color}
                    />
                  }
                />
                <Line
                  type="monotone"
                  dataKey="uv"
                  label='uv'
                  stroke="url(#uvGradient)"
                  dot={
                    <ChartDot
                      mean={UVGraphConfig.mean}
                      deviation={UVGraphConfig.deviation}
                      color={UVGraphConfig.color}
                    />
                  }
                />
                <Legend payload={legendPayload} />
            </LineChart>
        </ResponsiveContainer>
      </>
    );
}
