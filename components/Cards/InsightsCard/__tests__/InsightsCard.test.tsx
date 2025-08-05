import React from 'react';
import { InsightsCard } from '../InsightsCard';

describe('InsightsCard', () => {
  const defaultProps = {
    currentCity: 'San Francisco',
    nextDestination: 'Tokyo, Japan',
    daysUntilTrip: 14,
    completedItems: 12,
    yearlyGoal: 25,
    recentAchievement: 'Completed hiking challenge',
  };

  it('renders correctly with default props', () => {
    const component = <InsightsCard {...defaultProps} />;
    expect(component).toBeDefined();
    expect(component.props.currentCity).toBe('San Francisco');
    expect(component.props.nextDestination).toBe('Tokyo, Japan');
    expect(component.props.daysUntilTrip).toBe(14);
  });

  it('calculates progress correctly', () => {
    const component = <InsightsCard {...defaultProps} />;
    // Progress should be completedItems / yearlyGoal = 12/25 = 0.48
    expect(component.props.completedItems).toBe(12);
    expect(component.props.yearlyGoal).toBe(25);
  });

  it('handles custom props correctly', () => {
    const customProps = {
      currentCity: 'New York',
      nextDestination: 'Paris, France',
      daysUntilTrip: 7,
      completedItems: 5,
      yearlyGoal: 20,
      recentAchievement: 'Visited new restaurant',
    };

    const component = <InsightsCard {...customProps} />;
    expect(component.props.currentCity).toBe('New York');
    expect(component.props.nextDestination).toBe('Paris, France');
    expect(component.props.daysUntilTrip).toBe(7);
    expect(component.props.completedItems).toBe(5);
    expect(component.props.yearlyGoal).toBe(20);
    expect(component.props.recentAchievement).toBe('Visited new restaurant');
  });

  it('handles edge case with zero completed items', () => {
    const zeroProps = {
      ...defaultProps,
      completedItems: 0,
    };

    const component = <InsightsCard {...zeroProps} />;
    expect(component.props.completedItems).toBe(0);
    expect(component.props.yearlyGoal).toBe(25);
  });

  it('handles edge case with completed items equal to yearly goal', () => {
    const completedProps = {
      ...defaultProps,
      completedItems: 25,
      yearlyGoal: 25,
    };

    const component = <InsightsCard {...completedProps} />;
    expect(component.props.completedItems).toBe(25);
    expect(component.props.yearlyGoal).toBe(25);
  });

  it('handles single digit days correctly', () => {
    const singleDayProps = {
      ...defaultProps,
      daysUntilTrip: 1,
    };

    const component = <InsightsCard {...singleDayProps} />;
    expect(component.props.daysUntilTrip).toBe(1);
  });

  it('handles long destination names', () => {
    const longDestinationProps = {
      ...defaultProps,
      nextDestination: 'Very Long Destination Name That Might Wrap',
    };

    const component = <InsightsCard {...longDestinationProps} />;
    expect(component.props.nextDestination).toBe('Very Long Destination Name That Might Wrap');
  });

  it('handles long achievement names', () => {
    const longAchievementProps = {
      ...defaultProps,
      recentAchievement: 'Completed a very long and detailed achievement description',
    };

    const component = <InsightsCard {...longAchievementProps} />;
    expect(component.props.recentAchievement).toBe('Completed a very long and detailed achievement description');
  });
});