import type { ComponentEventData } from '@bos-web-engine/container';
import React from 'react';

import type {
  ComponentInstance,
  ComponentMetrics,
} from './types';

interface ComponentId {
  author: string;
  name: string;
  path: string;
  id: string;
  parent: ComponentId | null;
}

interface ComponentEvent {
  badgeClass: string;
  name: string;
  componentId: ComponentId;
  value: object,
}

export function ComponentMonitor({ components, metrics }: { components: ComponentInstance[], metrics: ComponentMetrics }) {
  const groupedComponents = components.reduce((componentsBySource, component) => {
    const source = component.componentId?.split('##')[0] || '';
    if (!componentsBySource[source]) {
      componentsBySource[source] = [];
    }

    componentsBySource[source].push(component);
    return componentsBySource;
  }, {} as { [key: string]: ComponentInstance[] });

  const sortedByFrequency = Object.entries(groupedComponents) as [string, ComponentInstance[]][];
  sortedByFrequency.sort(([, aComponents], [, bComponents]) => bComponents.length - aComponents.length);

  const reversedEvents = [...metrics.events];
  reversedEvents.reverse();

  const displayMetrics = {
    'Component Containers Loaded': metrics.componentsLoaded.length,
    'Component Renders': metrics.events.filter(({ type }) => type === 'component.render').length,
    'Component Updates Requested': metrics.events.filter(({ type }) => type === 'component.update').length,
    'Callbacks Invoked': metrics.events.filter(({ type }) => type === 'component.callbackInvocation').length,
    'Callbacks Returned': metrics.events.filter(({ type }) => type === 'component.callbackResponse').length,
    'Missing Components': metrics.missingComponents.length,
  };

  const parseComponentId = (componentId: string): ComponentId | null => {
    if (!componentId) {
      return null;
    }

    const [path, id, , ...ancestors] = componentId.split('##');
    const [author, , name] = path.split('/');
    return {
      author,
      name,
      path,
      id,
      parent: parseComponentId(ancestors.join('##')),
    };
  };

  const buildEventSummary = (event: ComponentEventData): ComponentEvent | null => {
    switch (event.type) {
      case 'component.render':
        return {
          badgeClass: 'bg-danger',
          name: 'render',
          componentId: parseComponentId(event.componentId)!,
          value: {
            node: Object.keys(event.node),
            children: event.childComponents.length,
          },
        };
      case 'component.callbackInvocation':
        return {
          badgeClass: 'bg-primary',
          name: 'invoke',
          componentId: parseComponentId(event.targetId)!,
          value: {
            requestId: event.requestId.split('-')[0],
            method: event.method.split('::')[0],
            args: event.args,
            caller: event.originator,
          },
        };
      case 'component.callbackResponse':
        return {
          badgeClass: 'bg-success',
          name: 'return',
          componentId: parseComponentId(event.targetId)!,
          value: {
            requestId: event.requestId.split('-')[0],
            result: event.result,
          },
        };
      case 'component.update':
        return {
          badgeClass: 'bg-warning',
          name: 'update',
          componentId: parseComponentId(event.componentId)!,
          value: {
            props: event.props,
          },
        };
      default:
        return null;
    }
  };

  return (
    <div id='component-monitor'>
      <div className='metrics'>
        {Object.entries(displayMetrics).map(([label, value], i) => (
          <div className='metrics-data-point' key={`data-point-${i}`}>
            <div className='data-point-header'>{label}</div>
            <div className='data-point-value'>{value}</div>
          </div>
        ))}
      </div>
      <div className='events'>
        <div className='metric-section-header'>Events</div>
        {
          reversedEvents
            .map(buildEventSummary)
            .map((event: ComponentEvent | null, i) => event && (
              <div key={i} className='event' onClick={() => console.log(event)}>
                <span className={`badge ${event.badgeClass} event-type-badge`}>
                  {event.name}
                </span>
                <strong>{event.componentId.name}{event.componentId.id && `(${event.componentId.id})`}</strong>
                {JSON.stringify(event.value)}
              </div>
            ))
        }
      </div>
      <div className='components'>
        <div className='metric-section-header'>Component Containers</div>
        {
          sortedByFrequency
            .map(([source, componentsBySource], i) => (
              <div className='component-row' key={`component-row-${i}`}>
                {componentsBySource.length} {source}
              </div>
            ))
        }
      </div>
    </div>
  );
}
