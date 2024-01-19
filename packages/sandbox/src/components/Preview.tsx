import type { WebEngineLocalComponents } from '@bos-web-engine/application';
import { ComponentTree, useWebEngine } from '@bos-web-engine/application';
import { Dropdown } from '@bos-web-engine/ui';
import { CaretDown, Eye } from '@phosphor-icons/react';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

import {
  ACCOUNT_ID,
  PREACT_VERSION,
  PREVIEW_UPDATE_DEBOUNCE_DELAY,
} from '../constants';
import { useDebouncedValue } from '../hooks/useDebounced';
import { useSandboxStore } from '../hooks/useSandboxStore';
import { convertFilePathToComponentName } from '../utils';

const Wrapper = styled.div`
  height: 100%;
  position: relative;
  color: #000;
  background: linear-gradient(-45deg, #6861bd, #72cbdb);
  box-sizing: border-box;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 2.5rem;
  box-sizing: border-box;
  padding: 1rem 1rem 0;
`;

const PinnedComponentSelector = styled.button`
  all: unset;
  display: flex;
  height: 100%;
  width: 100%;
  min-width: 0;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  font-family: var(--font-primary);
  font-size: 0.8rem;
  font-weight: 400;
  color: var(--color-text-1);
  background: rgba(0, 0, 0, 0.5);
  padding: 0 0.75rem;
  box-sizing: border-box;
  cursor: pointer;
  transition: all 200ms;
  mix-blend-mode: overlay;

  span {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  svg {
    flex-shrink: 0;
  }

  &:hover,
  &:focus {
    background: rgba(0, 0, 0, 0.75);
  }
`;

const Scroll = styled.div`
  position: absolute;
  inset: 2.5rem 1rem 1rem;
  overflow: auto;
  scroll-behavior: smooth;
  background: #fff;
`;

export function Preview() {
  const containerElement = useSandboxStore((store) => store.containerElement);
  const activeFilePath = useSandboxStore((store) => store.activeFilePath);
  const pinnedPreviewFilePath = useSandboxStore(
    (store) => store.pinnedPreviewFilePath
  );
  const setPinnedPreviewFile = useSandboxStore(
    (store) => store.setPinnedPreviewFile
  );
  const files = useSandboxStore((store) => store.files);
  const debouncedFiles = useDebouncedValue(
    files,
    PREVIEW_UPDATE_DEBOUNCE_DELAY
  );
  const [localComponents, setLocalComponents] =
    useState<WebEngineLocalComponents>();
  const [rootComponentPath, setRootComponentPath] = useState('');
  const previewFilePath = pinnedPreviewFilePath ?? activeFilePath;

  const { components, nonce } = useWebEngine({
    config: {
      preactVersion: PREACT_VERSION,
    },
    localComponents,
    rootComponentPath,
  });

  useEffect(() => {
    if (!previewFilePath) return;
    const componentName = convertFilePathToComponentName(previewFilePath);
    const componentPath = `${ACCOUNT_ID}/${componentName}`;
    setRootComponentPath(componentPath);
  }, [previewFilePath]);

  useEffect(() => {
    const editorComponents: WebEngineLocalComponents = {};

    Object.entries(debouncedFiles).forEach(([filePath, file]) => {
      if (!file) return;

      const fileType = filePath.split('.').pop() ?? '';

      if (!['jsx', 'tsx'].includes(fileType)) return;

      const componentName = convertFilePathToComponentName(filePath);
      const path = `${ACCOUNT_ID}/${componentName}`;

      editorComponents[path] = {
        source: file.source,
      };
    });

    setLocalComponents(editorComponents);
  }, [debouncedFiles]);

  return (
    <Wrapper>
      <Header>
        <Dropdown.Root>
          <Dropdown.Trigger asChild>
            <PinnedComponentSelector type="button">
              <Eye weight="fill" />
              <span>{pinnedPreviewFilePath ?? 'Current Editor Component'}</span>
              <CaretDown weight="bold" style={{ opacity: 0.65 }} />
            </PinnedComponentSelector>
          </Dropdown.Trigger>

          <Dropdown.Portal container={containerElement}>
            <Dropdown.Content sideOffset={4}>
              <Dropdown.Label>Preview:</Dropdown.Label>

              <Dropdown.RadioGroup
                value={pinnedPreviewFilePath || ''}
                onValueChange={(value) =>
                  setPinnedPreviewFile(value || undefined)
                }
              >
                <Dropdown.RadioItem value="">
                  <Dropdown.CheckedIndicator />
                  Current Editor Component
                </Dropdown.RadioItem>

                <hr />

                {Object.keys(files).map((path) => (
                  <Dropdown.RadioItem key={path} value={path}>
                    <Dropdown.CheckedIndicator />
                    {path}
                  </Dropdown.RadioItem>
                ))}
              </Dropdown.RadioGroup>
            </Dropdown.Content>
          </Dropdown.Portal>
        </Dropdown.Root>
      </Header>

      <Scroll>
        <ComponentTree
          key={nonce}
          components={components}
          rootComponentPath={rootComponentPath}
        />
      </Scroll>
    </Wrapper>
  );
}
