// Copyright 2024 The Perses Authors
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useChartsTheme } from '@perses-dev/components';
import { PanelDefinition } from '@perses-dev/core';
import { useReplaceVariablesInString } from '@perses-dev/plugin-system';
import DOMPurify from 'dompurify';
import { marked } from 'marked';
import React, { useMemo } from 'react';
import { MarkdownPanelOptions } from './model';
import './styles.css';

interface ChartProps {
  definition: PanelDefinition<MarkdownPanelOptions>;
  contentDimensions?: { width: number; height: number };
}

// Convert markdown to HTML
// Supports original markdown and GitHub Flavored markdown
function markdownToHTML(text: string): string {
  return marked.parse(text, { gfm: true });
}

// Prevent XSS attacks by removing the vectors for attacks
function sanitizeHTML(html: string): string {
  return DOMPurify.sanitize(html);
}

export function MarkdownChart(props: ChartProps) {
  const {
    definition: {
      spec: {
        plugin: {
          spec: { text },
        },
      },
    },
  } = props;

  const chartsTheme = useChartsTheme();

  const textAfterVariableReplacement = useReplaceVariablesInString(text);

  const html = useMemo(() => markdownToHTML(textAfterVariableReplacement ?? ''), [textAfterVariableReplacement]);
  const sanitizedHTML = useMemo(() => sanitizeHTML(html), [html]);

  return (
    <div
      style={{
        padding: `${chartsTheme.container.padding.default}px`,
        height: '100%',
        overflowY: 'auto',
      }}
      className="perses-markdown-chart-plugin"
      dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
    />
  );
}
