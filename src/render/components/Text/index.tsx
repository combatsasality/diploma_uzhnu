import { Typography } from "antd";
import type { ParagraphProps } from "antd/es/typography/Paragraph";
import type { TextProps } from "antd/es/typography/Text";
import type { TitleProps } from "antd/es/typography/Title";
import type { FC } from "react";
import { Trans } from "react-i18next";

import type { TxKeyPath } from "i18n";

const { Text: AntText, Title, Paragraph } = Typography;

// Base translation interface
export interface TranslationProps {
  children?: React.ReactNode;
  tx?: TxKeyPath;
  txOptions?: Record<string, unknown>;
  txFormatting?: { [tagName: string]: React.ReactElement } | React.ReactElement[];
  className?: string;
}

// Discriminated union with improved translation interface
type TextComponentProps =
  | ({
      preset?: "text";
    } & TranslationProps &
      Omit<TextProps, "children">)
  | ({
      preset: "title";
      level?: 1 | 2 | 3 | 4 | 5;
    } & TranslationProps &
      Omit<TitleProps, "children" | "level">)
  | ({
      preset: "paragraph";
    } & TranslationProps &
      Omit<ParagraphProps, "children">);

export const Text: FC<TextComponentProps> = (props) => {
  const translatedChildren = props.tx ? (
    <Trans
      i18nKey={props.tx as TxKeyPath}
      values={props.txOptions}
      components={props.txFormatting}
    />
  ) : (
    props.children
  );

  switch (props.preset) {
    case "title": {
      const { preset: _preset, ...titleProps } = props;
      return (
        <Title {...titleProps} className={`my-3! ${props.className ?? ""}`}>
          {translatedChildren}
        </Title>
      );
    }
    case "paragraph": {
      const { preset: _preset, ...paragraphProps } = props;
      return (
        <Paragraph {...paragraphProps} className={props.className}>
          {translatedChildren}
        </Paragraph>
      );
    }

    case "text":
    default: {
      const { preset: _preset, ...textProps } = props;
      return (
        <AntText {...textProps} className={props.className}>
          {translatedChildren}
        </AntText>
      );
    }
  }
};
