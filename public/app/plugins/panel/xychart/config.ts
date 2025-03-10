import {
  FieldColorModeId,
  FieldConfigProperty,
  FieldType,
  identityOverrideProcessor,
  SetFieldConfigOptionsArgs,
} from '@grafana/data';
import { LineStyle } from '@grafana/schema';
import { commonOptionsBuilder } from '@grafana/ui';

import { LineStyleEditor } from '../timeseries/LineStyleEditor';

import { ScatterFieldConfig, ScatterShow } from './types';

export const DEFAULT_POINT_SIZE = 5;

export function getScatterFieldConfig(cfg: ScatterFieldConfig): SetFieldConfigOptionsArgs<ScatterFieldConfig> {
  return {
    standardOptions: {
      [FieldConfigProperty.Min]: {
        hideFromDefaults: true,
      },
      [FieldConfigProperty.Max]: {
        hideFromDefaults: true,
      },
      [FieldConfigProperty.Unit]: {
        hideFromDefaults: true,
      },
      [FieldConfigProperty.Decimals]: {
        hideFromDefaults: true,
      },
      [FieldConfigProperty.NoValue]: {
        hideFromDefaults: true,
      },
      [FieldConfigProperty.DisplayName]: {
        hideFromDefaults: true,
      },

      [FieldConfigProperty.Thresholds]: {
        hideFromDefaults: true,
      },
      [FieldConfigProperty.Mappings]: {
        hideFromDefaults: true,
      },

      // TODO: this still leaves Color series by: [ Last | Min | Max ]
      // because item.settings?.bySeriesSupport && colorMode.isByValue
      [FieldConfigProperty.Color]: {
        settings: {
          byValueSupport: true,
          bySeriesSupport: true,
          preferThresholdsMode: false,
        },
        defaultValue: {
          mode: FieldColorModeId.PaletteClassic,
        },
      },
    },

    useCustomConfig: (builder) => {
      builder
        .addRadio({
          path: 'show',
          name: 'Show',
          defaultValue: cfg.show,
          settings: {
            options: [
              { label: 'Points', value: ScatterShow.Points },
              { label: 'Lines', value: ScatterShow.Lines },
              { label: 'Both', value: ScatterShow.PointsAndLines },
            ],
          },
        })
        .addSliderInput({
          path: 'pointSize.fixed',
          name: 'Point size',
          defaultValue: cfg.pointSize?.fixed ?? DEFAULT_POINT_SIZE,
          settings: {
            min: 1,
            max: 100,
            step: 1,
          },
          showIf: (c) => c.show !== ScatterShow.Lines,
        })
        .addCustomEditor<void, LineStyle>({
          id: 'lineStyle',
          path: 'lineStyle',
          name: 'Line style',
          showIf: (c) => c.show !== ScatterShow.Points,
          editor: LineStyleEditor,
          override: LineStyleEditor,
          process: identityOverrideProcessor,
          shouldApply: (f) => f.type === FieldType.number,
        })
        .addSliderInput({
          path: 'lineWidth',
          name: 'Line width',
          defaultValue: cfg.lineWidth,
          settings: {
            min: 0,
            max: 10,
            step: 1,
          },
          showIf: (c) => c.show !== ScatterShow.Points,
        });

      commonOptionsBuilder.addAxisConfig(builder, cfg);
      commonOptionsBuilder.addHideFrom(builder);
    },
  };
}
