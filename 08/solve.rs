use std::io;
use std::io::BufRead;
use std::io::Result;

// A (2D) Map of tree
#[derive(Debug)]
struct Map(Vec<Vec<u8>>);

impl Map {
    pub fn new_from_stdin() -> Result<Map> {
        let mut map = vec![];
        let stdin = io::stdin();
        for line in stdin.lock().lines() {
            let line = line?;
            let line = line
                .chars()
                .map(|c| c.to_digit(10).unwrap() as u8)
                .collect();
            map.push(line);
        }
        Ok(Map(map))
    }

    pub fn nb_lines(&self) -> usize {
        self.0.len()
    }

    pub fn nb_columns(&self) -> usize {
        self.0[0].len()
    }
}

#[derive(Copy, Clone, Debug)]
struct Coord {
    pub line_idx: usize,
    pub column_idx: usize,
}

impl Coord {
    pub fn new(line_idx: usize, column_idx: usize) -> Self {
        Self {
            line_idx,
            column_idx,
        }
    }
}

// We can index the map with the coordinate (and get the heigh at this coordinate)
impl std::ops::Index<Coord> for Map {
    type Output = u8;
    fn index(&self, index: Coord) -> &u8 {
        &self.0[index.line_idx][index.column_idx]
    }
}

// Something that iterate on all the coordinates of the map
struct MapIter<'map> {
    map: &'map Map,
    current_coord: Option<Coord>,
}

impl Iterator for MapIter<'_> {
    type Item = Coord;
    fn next(&mut self) -> Option<Self::Item> {
        match self.current_coord {
            None => None,
            Some(current) => {
                self.current_coord = if current.column_idx < self.map.nb_columns() - 1 {
                    Some(Coord::new(current.line_idx, current.column_idx + 1))
                } else {
                    if current.line_idx < self.map.nb_lines() - 1 {
                        Some(Coord::new(current.line_idx + 1, 0))
                    } else {
                        None
                    }
                };
                Some(current)
            }
        }
    }
}

// We can construct a interator from a map reference
impl<'map> IntoIterator for &'map Map {
    type Item = Coord;
    type IntoIter = MapIter<'map>;

    fn into_iter(self) -> Self::IntoIter {
        MapIter {
            map: self,
            current_coord: Some(Coord {
                line_idx: 0,
                column_idx: 0,
            }),
        }
    }
}

#[derive(Copy, Clone)]
enum Direction {
    North,
    South,
    West,
    Est,
}

static ALL_DIRS: [Direction; 4] = [
    Direction::North,
    Direction::South,
    Direction::West,
    Direction::Est,
];

// A point of view in the map. From a pov, we can see a line of tree.
// We can iterate this line, from the position to the end of the map.
struct PointOfView<'map> {
    map: &'map Map,
    coord: Coord,
    dir: Direction,
}
impl<'map> PointOfView<'map> {
    pub fn new(map: &'map Map, coord: Coord, dir: Direction) -> Self {
        Self { map, coord, dir }
    }
    // Are we in the border of the map (in regard of the direction)
    // Ie. Do we have trees to see ?
    pub fn is_on_border(&self) -> bool {
        match self.dir {
            Direction::North => self.coord.line_idx == 0,
            Direction::South => self.coord.line_idx == self.map.nb_lines() - 1,
            Direction::West => self.coord.column_idx == 0,
            Direction::Est => self.coord.column_idx == self.map.nb_columns() - 1,
        }
    }
}
impl Iterator for PointOfView<'_> {
    type Item = u8;
    fn next(&mut self) -> Option<Self::Item> {
        if self.is_on_border() {
            None
        } else {
            match self.dir {
                Direction::North => self.coord.line_idx -= 1,
                Direction::South => self.coord.line_idx += 1,
                Direction::West => self.coord.column_idx -= 1,
                Direction::Est => self.coord.column_idx += 1,
            };
            Some(self.map[self.coord])
        }
    }
}

// --------------- Round 1 ---------------------

// Check if the current `height` is visible from the border of the map
// ie. if all heights in the line of trees are lower that us.
fn is_line_hide_our_tree(tree_height: u8, mut line_of_trees: PointOfView<'_>) -> bool {
    line_of_trees.all(|h| h < tree_height)
}

// Check is a coord is visible
fn is_visible_from_border(map: &Map, coord: Coord) -> bool {
    ALL_DIRS
        .iter()
        .any(|d| is_line_hide_our_tree(map[coord], PointOfView::new(map, coord, *d)))
}

fn count_visible(map: &Map) -> usize {
    map.into_iter()
        .filter(|c| is_visible_from_border(map, *c))
        .count()
}

// --------------- Round 2 ---------------------
fn get_scenery(tree_height: u8, line_of_trees: PointOfView<'_>) -> usize {
    let mut count = 0;
    for h in line_of_trees {
        count += 1;
        if h >= tree_height {
            break;
        }
    }
    count
}

fn get_scenery_in_map(map: &Map, coord: Coord) -> usize {
    ALL_DIRS
        .iter()
        .map(|d| get_scenery(map[coord], PointOfView::new(map, coord, *d)))
        .product()
}

fn best_scenery(map: &Map) -> usize {
    map.into_iter()
        .map(|c| get_scenery_in_map(map, c))
        .max()
        .unwrap()
}

// -------------------------------------------

fn main() {
    let map = Map::new_from_stdin().unwrap();
    println!("Visible : {}", count_visible(&map));
    println!("Best Scenery : {}", best_scenery(&map));
}
