Feature: TfL Journey Planning

  Scenario: Plan the quickest journey from Notting Hill Gate to Southbank Centre
    Given I am at "69 Notting Hill Gate, London"
    And I want to go to "Southbank Centre, London"
    When I plan the quickest journey
    Then I should see the quickest journey plan

  Scenario: Plan the journey from Notting Hill Gate, London to Bristol Temple Meads
    Given I am at "69 Notting Hill Gate, London"
    And I want to go to "Bristol Temple Meads, Bristol"
    When I plan the journey
    Then I should see the journey plan

  Scenario: Plan a journey from Luton Airport to Notting Hill Gate, arriving by 8:50am
    Given I am arriving at "Luton Airport" next Wednesday
    And I need to be at "69 Notting Hill Gate, London" by "08:50"
    When I plan the latest possible departure journey
    Then I should see the latest possible departure time
