import type { FC } from "react";
import { Button as AntButton } from "antd";
import { Trans } from "react-i18next";
import { TranslationProps } from "components/Text";
import { BaseButtonProps } from "antd/es/button/Button";

type ButtonProps = TranslationProps & Omit<BaseButtonProps, "children">;

export const Button: FC<ButtonProps> = (props) => {
  const { tx, txOptions, txFormatting, children, ...buttonProps } = props;

  // If translation key is provided, we ignore children and use translation
  const buttonChildren = tx ? (
    <Trans i18nKey={tx as any} values={txOptions} components={txFormatting} />
  ) : (
    children
  );

  return <AntButton {...buttonProps}>{buttonChildren}</AntButton>;
};
